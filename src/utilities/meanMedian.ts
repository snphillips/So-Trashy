import * as d3 from "d3";
import { DataItemType, RefuseTypes, MeanMedianType } from "../types/types";
import { poundsPerPerson } from "./poundsPerPerson";
import { formatPoundsPerPerson } from "./formatPoundsPerPerson";

export function getmeanMedian(
  data: DataItemType[],
  refuseType: RefuseTypes,
  year: number,
): MeanMedianType | null {
  if (!data.length) return null;

  const values = data.map((d) => poundsPerPerson(d, refuseType, year));
  const mean = d3.mean(values);
  const median = d3.median(values);

  if (mean === undefined || median === undefined) return null;

  return {
    mean: `mean: ${formatPoundsPerPerson(mean)} pounds/person`,
    median: `median: ${formatPoundsPerPerson(median)} pounds/person`,
  };
}
