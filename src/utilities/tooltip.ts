import * as d3 from "d3";
import { DataItemType, RefuseTypes } from "../types/types";
import { formatPoundsPerPerson } from "./formatPoundsPerPerson";

const MOBILE_BREAKPOINT_PX = 768;

export function ensureTooltipShelf(): void {
  if (document.getElementById("info-shelf")) return;

  const shelf = document.createElement("div");
  shelf.id = "info-shelf";
  shelf.className = "shelf hidden";
  shelf.innerHTML = `
    <button class="close-btn" aria-label="Close information panel">x</button>
    <div class="shelf-content"></div>
  `;
  document.body.appendChild(shelf);

  shelf.querySelector(".close-btn")?.addEventListener("click", () => {
    shelf.classList.remove("visible");
    shelf.classList.add("hidden");
  });
}

export function getOrCreateTooltip(): d3.Selection<
  HTMLDivElement,
  unknown,
  HTMLElement,
  any
> {
  let tooltip = d3.select<HTMLDivElement, unknown>(".tool-tip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div").attr("class", "tool-tip");
  }
  return tooltip;
}

export function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const minX = window.scrollX + 15;
  const minY = window.scrollY + 15;
  const maxX = window.scrollX + window.innerWidth - width;
  const maxY = window.scrollY + window.innerHeight - height;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}

export function isMobileViewport(): boolean {
  return window.innerWidth <= MOBILE_BREAKPOINT_PX;
}

export function generateTooltipHTML(
  d: DataItemType,
  refuseType: RefuseTypes,
  year: number,
  getPopulation: (d: DataItemType) => number,
): string {
  const totalRefuse =
    d.mgptonscollected +
    d.resorganicstons +
    d.papertonscollected +
    d.refusetonscollected +
    d.xmastreetons +
    d.leavesorganictons;

  const refuseCategories: { key: keyof DataItemType; name: string }[] = [
    { key: "refusetonscollected", name: "trash" },
    { key: "papertonscollected", name: "paper & cardboard" },
    { key: "mgptonscollected", name: "metal/glass/plastic" },
    { key: "resorganicstons", name: "brown bin organics" },
    { key: "leavesorganictons", name: "leaves" },
    { key: "xmastreetons", name: "christmas trees" },
  ];

  const listItems = refuseCategories
    .map((category) => {
      const percent = totalRefuse
        ? ((d[category.key] as number) * 100) / totalRefuse
        : 0;
      return `<li>${category.name}: ${percent.toFixed(1)}%</li>`;
    })
    .join("<br/>");

  const tooltipYear = year >= 2020 ? "2020" : "2010";

  return `
    <h4>${d.communityDistrictName}</h4>
    ${tooltipYear} population: ${new Intl.NumberFormat().format(getPopulation(d))} <br/>
    neighborhood total: ${new Intl.NumberFormat().format(d[refuseType])} tons/year<br/>
    per person: ${Math.round((d[refuseType] / getPopulation(d)) * 2000)} pounds/year<br/><br/>
    <ul>${listItems}</ul>
  `;
}
