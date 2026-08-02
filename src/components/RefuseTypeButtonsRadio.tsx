import { ChangeEvent } from "react";
import { isRefuseTypeAvailable } from "../utilities/getRefuseDataNote";

type Props = {
  refuseTypeSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
  year: number;
};

export default function RefuseTypeButtonsRadio({
  refuseTypeSubmit,
  year,
}: Props) {
  const organicsAvailable = isRefuseTypeAvailable(year, "resorganicstons");
  const leavesAvailable = isRefuseTypeAvailable(year, "leavesorganictons");
  return (
    <form
      className="radio-toolbar"
      id="radio-toolbar-type"
      onChange={refuseTypeSubmit}
    >
      <fieldset>
        <legend id="refuse-radio-group-label" className="screen-reader-only">
          Choose a refuse collection type
        </legend>

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="allcollected"
          value="all trash/recycling/compost"
          defaultChecked
        />
        <label htmlFor="allcollected">all trash/recycling/compost</label>
        <br />

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="refusetonscollected"
          value="trash"
        />
        <label htmlFor="refusetonscollected">🗑️ trash</label>
        <br />

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="papertonscollected"
          value="paper & cardboard"
        />
        <label htmlFor="papertonscollected">🗞️📦 paper & cardboard</label>
        <br />

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="mgptonscollected"
          value="metal/glass/plastic"
        />
        <label htmlFor="mgptonscollected">🥫🍾🧃 metal/glass/plastic</label>
        <br />

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="resorganicstons"
          value="brown bin organics"
          disabled={!organicsAvailable}
        />
        <label
          htmlFor="resorganicstons"
          className={!organicsAvailable ? "disabled-label" : ""}
        >
          🥬🥕🍎 brown bin organics
        </label>
        <br />

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="leavesorganictons"
          value="leaves"
          disabled={!leavesAvailable}
        />
        <label
          htmlFor="leavesorganictons"
          className={!leavesAvailable ? "disabled-label" : ""}
        >
          🍂 leaves
        </label>
        <br />

        <input
          type="radio"
          className="radio-type"
          name="radioType"
          id="xmastreetons"
          value="christmas trees"
        />
        <label htmlFor="xmastreetons">🎄 christmas trees</label>
      </fieldset>
    </form>
  );
}
