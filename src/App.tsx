import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import * as d3 from "d3";
import _lodash from "lodash";
import popNeighbData from "./data/popNeighbData";
import Sidebar from "./components/Sidebar";
import ChartHeader from "./components/ChartHeader";
import BarChart from "./components/BarChart";
import { drawChart } from "./utilities/drawChart";
import { convertWeightStringToNumber } from "./utilities/convertWeightStringToNumber";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  RefuseTypes,
  DataItemType,
  CityResponseDataType,
  CityDataWeightsAsNumbersType,
} from "./types/types";

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DataItemType[]>([]);
  const [year, setYear] = useState(new Date().getFullYear()); // defaults to current year
  const [refuseType, setRefuseType] = useState<RefuseTypes>("allcollected");
  const [sortOrder, setSortOrder] = useState("sort ascending");

  useEffect(() => {
    // Handle changes to data, sortOrder, and refuseType
    if (data.length) {
      dataSortAscDescOrAlphabetically(data);
      drawChart(data, refuseType, year);
    }
  }, [data, sortOrder, refuseType, year]);

  useEffect(() => {
    getData();
  }, [year]);

  // The getData function is wrapped with useCallback
  // to ensure it's consistent across renders
  // unless the selected year changes.
  // The if (!signal?.aborted) guard in .finally() avoids
  // a flicker where an aborted request's cleanup briefly
  // flips loading to false right before the new request
  // flips it back to true.
  const getData = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true);
      const openDataSourceLink = `https://data.cityofnewyork.us/resource/8bkb-pvci.json?$where=month like '%25${year}%25'`;

      fetch(openDataSourceLink)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json();
        })
        .then((responseData: CityResponseDataType[]) => {
          const cityResponseData = responseData;
          const monthsFixed = removeExtraSpacesInMonthValue(cityResponseData);
          const weightsAreNumbers = convertWeightStringToNumber(monthsFixed);
          const withBoroughDistrict =
            addBoroughDistrictToData(weightsAreNumbers);
          const withNeighbNamesAndPop =
            addNeighborhoodNamesAndPopulation(withBoroughDistrict);
          const monthsAdded = add12Months(withNeighbNamesAndPop);
          const allRefuseTypesAdded = addAllRefuseTypes(monthsAdded);

          setData(allRefuseTypesAdded);
        })
        .catch((error) => {
          console.error("getData() error: ", error);

          if (error instanceof TypeError) {
            // fetch throws a generic TypeError for network failures
            // (offline, DNS failure, CORS block, etc.)
            setError(
              navigator.onLine
                ? "Couldn't reach the server. Please try again later."
                : "You appear to be offline. Please check your internet connection.",
            );
          } else {
            setError("Failed to load data. Please try again later.");
          }
          // TODO: Add a UI element to show user an error. The rat?
          // Add this to jsx {error && <p className="error-message">{error}</p>}
        })
        .finally(() => {
          if (!signal?.aborted) setLoading(false);
        });
    },
    [year],
  );

  /* ==================================
   Add key:value that contains both borough & district together
   ================================== */
  function addBoroughDistrictToData(dataArray: CityDataWeightsAsNumbersType[]) {
    const newData = dataArray.map((entry) => ({
      ...entry,
      boroughDistrict: entry.borough + " " + entry.communitydistrict,
    }));
    return newData;
  }

  /* ==================================
   Add key:value that contains total weight all refuse
   (add trash + recycling + compost for a grand total)
   ================================== */
  function addAllRefuseTypes(dataArray: DataItemType[]) {
    const newData = dataArray.map((entry) => {
      const newKey = Object.assign({}, entry);
      newKey.allcollected =
        entry.refusetonscollected +
        entry.papertonscollected +
        entry.mgptonscollected +
        entry.resorganicstons +
        entry.xmastreetons +
        entry.leavesorganictons;
      return newKey;
    });
    return newData;
  }
  /* ==================================
   Getting the neighborhood & population data from one dataset,
   and adding it to the main dataset
   ================================== */
  function addNeighborhoodNamesAndPopulation(dataArray: any[]) {
    const newData = dataArray.map((entry) => {
      const matchedNeighb = popNeighbData.find(
        (popEntry) => entry.boroughDistrict === popEntry.boroughDistrict,
      );
      /* 
       Weird edge case: in 2020 the DSNY Monthly Tonnage by District 
       dataset introduced a Community District in Queens called 7A 
       (I don't know what that is). There is no corresponding 7A in
       the New York City Population By Community Districts dataset,
       so the presence of 7A breaks the algorithm. Below, when we
       encounter it, it simply "returns" and moves onto the next entry.
       This handles the 7A case (and any other unmatched district)
       */
      if (!matchedNeighb) return entry;

      return {
        ...entry,
        communityDistrictName: matchedNeighb.communityDistrictName,
        _2020_population: matchedNeighb._2020_population,
        _2010_population: matchedNeighb._2010_population,
      };
    });
    return newData;
  }

  /*
   ==================================
  Sorts the data ascending, descending or alphabetically,
  depending on user choice
  ==================================
  */
  function dataSortAscDescOrAlphabetically(data: DataItemType[]) {
    // We use the 2010 population data up until 2019, then 2020 data
    const population = (entry: DataItemType) =>
      year >= 2020 ? entry._2020_population : entry._2010_population;

    if (sortOrder === "sort ascending") {
      data.sort((a, b) =>
        d3.ascending(
          a[refuseType] / population(a),
          b[refuseType] / population(b),
        ),
      );
    } else if (sortOrder === "sort descending") {
      data.sort((a, b) =>
        d3.descending(
          a[refuseType] / population(a),
          b[refuseType] / population(b),
        ),
      );
    } else if (sortOrder === "sort alphabetical") {
      data.sort((a, b) => d3.descending(b.boroughDistrict, a.boroughDistrict));
    } else {
      // Ascending is the default
      data.sort((a, b) =>
        d3.ascending(
          a[refuseType] / population(a),
          b[refuseType] / population(b),
        ),
      );
    }
  }

  /* ==================================
  The raw data from the city has extra spaces in the month
  like this: '2023 / 04'. Here we remove those spaces.
  Build a new object with { ...entry, ... } instead of writing directly onto entry
  ================================== */
  function removeExtraSpacesInMonthValue(dataArray: CityResponseDataType[]) {
    const newData = dataArray.map((entry) => ({
      ...entry,
      month: entry.month.replace(/\s+/g, ""),
    }));
    return newData;
  }

  /* ==================================
  The source data is monthly, but we're only interested in yearly totals
  So, the 12 months of data need to be added all together.
  ================================== */
  function add12Months(dataArray: any[]) {
    /*
    1) Find all the unique districts (so we can later add their monthly totals)
    This creates an array of 59 objects with ALL the data
    We're only interested in the boroughDistrict strings 
    */
    const dataArrayWithUniqueDistricts = _lodash.uniqBy(dataArray, (item) => {
      return item.boroughDistrict;
    });
    // This creates an array of 59 unique boroughDistrict strings. I.e. - 'Brooklyn 06'
    const allBoroughDistrictsArray: string[] = _lodash.map(
      dataArrayWithUniqueDistricts,
      (item) => {
        return item.boroughDistrict;
      },
    );

    /* 
    2) For every boroughDistrict,
    filter some information we'll need from dataArray,
    and the sum of all 12 months tonnage per year
    */
    const sumByKey = (items: DataItemType[], key: RefuseTypes): number =>
      _lodash.sumBy(items, (item) => item[key]);

    const newData: DataItemType[] = _lodash.map(
      allBoroughDistrictsArray,
      (boroughDistrict: string) => {
        const allBoroughDistricts: DataItemType[] = _lodash.filter(
          dataArray,
          (item: DataItemType) => {
            return item.boroughDistrict === boroughDistrict;
          },
        );

        const tonnageKeys: RefuseTypes[] = [
          "refusetonscollected",
          "papertonscollected",
          "mgptonscollected",
          "resorganicstons",
          "leavesorganictons",
          "schoolorganictons",
          "xmastreetons",
        ];

        const tonnages: Partial<DataItemType> = {};
        tonnageKeys.forEach((key) => {
          tonnages[key] = sumByKey(allBoroughDistricts, key);
        });

        return {
          boroughDistrict: boroughDistrict,
          borough: allBoroughDistricts[0].borough,
          communityDistrictName: allBoroughDistricts[0].communityDistrictName,
          _2010_population: allBoroughDistricts[0]._2010_population,
          _2020_population: allBoroughDistricts[0]._2020_population,
          ...tonnages,
        } as DataItemType;
      },
    );
    return newData;
  }

  function refuseTypeSubmit(event: ChangeEvent<HTMLFormElement>): void {
    setRefuseType(event.target.id as RefuseTypes);
  }

  function yearDropdownSubmit(event: ChangeEvent<HTMLFormElement>): void {
    const selectedYear = Number(event.target.value);
    setYear(selectedYear);
    event.preventDefault();
  }

  function sortOrderRadioSubmit(event: ChangeEvent<HTMLFormElement>): void {
    setSortOrder(event.target.value);
  }

  return (
    <div className="App row">
      <div className="sidebar-container col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
        <Sidebar
          year={year}
          refuseTypeSubmit={refuseTypeSubmit}
          yearDropdownSubmit={yearDropdownSubmit}
          sortOrderRadioSubmit={sortOrderRadioSubmit}
        />
      </div>

      <div className="chart-container col-xs-12 col-sm-8 col-md-9 col-lg-9 col-xl-9">
        <ChartHeader year={year} refuseType={refuseType} />
        <LoadingSpinner loading={loading} />
        <BarChart />
      </div>
    </div>
  );
}
