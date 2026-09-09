import { RefuseTypes, RefuseHeadingType } from "../types/types";
import { getRefuseDataNote } from "../utilities/getRefuseDataNote";
import { getMeanMedian } from "../utilities/getMeanMedian";

type Props = {
  year: number;
  refuseType: RefuseTypes;
};

export default function ChartHeader({ year, refuseType }: Props) {
  console.log("ChartHeader props:", { year, refuseType });
  let heading: RefuseHeadingType;

  switch (refuseType) {
    case "allcollected":
      heading = "Trash/Recycling/Compost";
      break;
    case "refusetonscollected":
      heading = "Trash";
      break;
    case "papertonscollected":
      heading = "Paper & Cardboard";
      break;
    case "mgptonscollected":
      heading = "Metal/Glass/Plastic";
      break;
    case "resorganicstons":
      heading = "Organics";
      break;
    case "leavesorganictons":
      heading = "Leaves";
      break;
    case "xmastreetons":
      heading = "Christmas Trees";
      break;
    default:
      heading = "Trash/Recycling/Compost";
  }

  const note = getRefuseDataNote(year, refuseType);
  const meanMedian = getMeanMedian(year, refuseType);
  console.log("note lookup result:", note);
  console.log("meanMedian lookup result:", meanMedian);

  return (
    <div>
      <h2>
        <span id="chart-description">Comparing {heading} Collection for </span>
        <span id="chart-year">{year}</span>
      </h2>
      {note && <p id="chart-data-note">{note}</p>}
      {meanMedian && <p id="mean-median-phrase">{meanMedian}</p>}
    </div>
  );
}
