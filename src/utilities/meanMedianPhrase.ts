import * as d3 from "d3";
import { DataItemType, RefuseTypes } from "../types/types";
import { poundsPerPerson } from "./poundsPerPerson";
import { formatPoundsPerPerson } from "./formatPoundsPerPerson";

export function getMeanMedianPhrase(
  data: DataItemType[],
  refuseType: RefuseTypes,
  year: number,
): string {
  if (!data.length) return "";

  const values = data.map((d) => poundsPerPerson(d, refuseType, year));

  const mean = d3.mean(values);
  const median = d3.median(values);

  if (mean === undefined || median === undefined) return "";

  return `mean: ${formatPoundsPerPerson(mean)} pounds/person, median: ${formatPoundsPerPerson(median)} pounds/person`;
}
