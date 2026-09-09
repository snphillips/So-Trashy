import { DataItemType, RefuseTypes } from "../types/types";
import { LBS_PER_TON } from "./constants";

export function getPopulation(d: DataItemType, year: number): number {
  return year >= 2020 ? d._2020_population : d._2010_population;
}

export function poundsPerPerson(
  d: DataItemType,
  refuseType: RefuseTypes,
  year: number,
): number {
  return (d[refuseType] / getPopulation(d, year)) * LBS_PER_TON;
}
