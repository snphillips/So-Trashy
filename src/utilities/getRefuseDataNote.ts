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
