import { refuseDataNotes } from "../data/refuseDataNotes";
import { RefuseTypes } from "../types/types";

export function getRefuseDataNote(
  year: number,
  refuseType: RefuseTypes,
): string | undefined {
  return refuseDataNotes.find(
    (entry) => entry.year === year && entry.refuseType === refuseType,
  )?.note;
}

export function isRefuseTypeAvailable(
  year: number,
  refuseType: RefuseTypes,
): boolean {
  const entry = refuseDataNotes.find(
    (entry) => entry.year === year && entry.refuseType === refuseType,
  );
  return entry ? entry.dataAvailable : true; // no entry = assume available
}
