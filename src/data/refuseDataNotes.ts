import { RefuseDataNoteType } from "../types/types";

/*
  ==================================
  Documents known gaps or quirks in the city's refuse data —
  e.g. a refuse type wasn't collected, wasn't measured separately,
  or reporting changed for a given year.
  ==================================
*/
export const refuseDataNotes: RefuseDataNoteType[] = [
  {
    year: 2010,
    refuseType: "leavesorganictons",
    note: "In 2010 the city did not measure the collection of leaves.",
    dataAvailable: false,
  },
  {
    year: 2011,
    refuseType: "leavesorganictons",
    note: "In 2011 the city did not measure the collection of leaves.",
    dataAvailable: false,
  },
  {
    year: 2012,
    refuseType: "leavesorganictons",
    note: "In 2012 the city did not measure the collection of leaves.",
    dataAvailable: false,
  },
  {
    year: 2013,
    refuseType: "leavesorganictons",
    note: "In 2013 the city did not measure the collection of leaves.",
    dataAvailable: false,
  },
  {
    year: 2014,
    refuseType: "leavesorganictons",
    note: "In 2014 the city did not measure the collection of leaves.",
    dataAvailable: false,
  },
  {
    year: 2015,
    refuseType: "leavesorganictons",
    note: "In 2015 the city did not measure the collection of leaves.",
    dataAvailable: false,
  },
  {
    year: 2010,
    refuseType: "resorganicstons",
    note: "In 2010 the city did not measure the collection of brown bin organics.",
    dataAvailable: false,
  },
  {
    year: 2011,
    refuseType: "resorganicstons",
    note: "In 2011 the city did not measure the collection of brown bin organics.",
    dataAvailable: false,
  },
  {
    year: 2012,
    refuseType: "resorganicstons",
    note: "In 2012 the city did not measure the collection of brown bin organics.",
    dataAvailable: false,
  },
  {
    year: 2013,
    refuseType: "resorganicstons",
    note: "In 2013 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2014,
    refuseType: "resorganicstons",
    note: "In 2014 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2015,
    refuseType: "resorganicstons",
    note: "In 2015 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2016,
    refuseType: "resorganicstons",
    note: "In 2016 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2017,
    refuseType: "resorganicstons",
    note: "In 2017 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2018,
    refuseType: "resorganicstons",
    note: "In 2018 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2019,
    refuseType: "resorganicstons",
    note: "In 2019 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2020,
    refuseType: "resorganicstons",
    note: "In 2020 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2021,
    refuseType: "resorganicstons",
    note: "In 2021 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2022,
    refuseType: "resorganicstons",
    note: "In 2022 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  {
    year: 2023,
    refuseType: "resorganicstons",
    note: "In 2023 brown bin organics wasn't collected city-wide.",
    dataAvailable: true,
  },
  // add more entries as you find them
];

export default refuseDataNotes;
