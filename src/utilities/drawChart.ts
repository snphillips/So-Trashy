import * as d3 from "d3";
import { DataItemType, RefuseTypes } from "../types/types";
import {
  ensureTooltipShelf,
  getOrCreateTooltip,
  clampPosition,
  isMobileViewport,
  generateTooltipHTML,
} from "./tooltip";

const LBS_PER_TON = 2000;

export function drawChart(
  data: DataItemType[],
  refuseType: RefuseTypes,
  year: number,
) {
  const getPopulation = (d: DataItemType) =>
    year >= 2020 ? d._2020_population : d._2010_population;

  const poundsPerPerson = (d: DataItemType) =>
    (d[refuseType] / getPopulation(d)) * LBS_PER_TON;

  d3.selectAll("svg > *").remove();
  const svg = d3.select("svg");

  const margin = { top: 60, right: 140, bottom: 190, left: 150 };
  const width = Number(svg.attr("width"));
  const height = Number(svg.attr("height"));
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const colorBars = d3
    .scaleOrdinal<string, string>()
    .domain(["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"])
    .range(["#21E0D6", "#EF767A", "#820933", "#6457A6", "#2C579E"]);

  ensureTooltipShelf();
  const tooltip = getOrCreateTooltip();
  const isMobile = isMobileViewport();

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, poundsPerPerson)!])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.boroughDistrict))
    .range([0, innerHeight])
    .padding(0.1);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let yAxisGroup = g.select<SVGGElement>(".y-axis");
  if (yAxisGroup.empty()) {
    yAxisGroup = g.append("g").attr("class", "y-axis");
  }

  let xAxisTopGroup = g.select<SVGGElement>(".x-axis-top");
  if (xAxisTopGroup.empty()) {
    xAxisTopGroup = g.append("g").attr("class", "x-axis-top");
  }

  let xAxisBottomGroup = g.select<SVGGElement>(".x-axis-bottom");
  if (xAxisBottomGroup.empty()) {
    xAxisBottomGroup = g
      .append("g")
      .attr("class", "x-axis-bottom")
      .attr("transform", `translate(0, ${innerHeight})`);
  }

  yAxisGroup.call(d3.axisLeft(yScale));
  xAxisTopGroup.call(d3.axisTop(xScale));
  xAxisBottomGroup.call(d3.axisBottom(xScale));

  /* Bars */
  const bars = g.selectAll<SVGRectElement, DataItemType>("rect").data(data);
  bars.exit().remove();

  const barsEnter = bars
    .enter()
    .append("rect")
    .attr("tabindex", "0")
    .attr("role", "img")
    .attr("aria-roledescription", "bar in bar chart");

  barsEnter
    .merge(bars)
    .attr("aria-label", (d: DataItemType) => {
      const perPerson = Math.round(poundsPerPerson(d));
      return `${d.communityDistrictName}, ${perPerson} pounds of ${refuseType} per person per year`;
    })
    .style("fill", (d: DataItemType): string => colorBars(d.borough))
    .attr("y", (d: DataItemType) => yScale(d.boroughDistrict) as number)
    .attr("width", (d: DataItemType) => xScale(poundsPerPerson(d)))
    .attr("height", yScale.bandwidth());

  if (!isMobile) {
    barsEnter
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
      .on("keydown", function (event, d) {
        if (event.key === "Enter" || event.key === " ") {
          handleMouseOver.call(this, event, d);
          event.preventDefault();
        }
        if (event.key === "Escape") {
          handleMouseOut.call(this, event, d);
        }
      })
      .on("blur", function (event, d) {
        handleMouseOut.call(this, event, d);
      });
  }

  barsEnter.on("click", function (event, d) {
    g.selectAll<SVGRectElement, DataItemType>("rect").style(
      "fill",
      (d): string => colorBars(d.borough),
    );
    d3.select(this).style("fill", "#ffcd44");

    if (isMobile) {
      const shelf = document.getElementById("info-shelf");
      const content = shelf?.querySelector(".shelf-content");

      if (shelf && content) {
        content.innerHTML = generateTooltipHTML(
          d,
          refuseType,
          year,
          getPopulation,
        );
        shelf.classList.add("visible");
        shelf.classList.remove("hidden");
      }
    } else {
      tooltip
        .classed("hidden", false)
        .html(generateTooltipHTML(d, refuseType, year, getPopulation));
      const tooltipNode = tooltip.node();
      if (tooltipNode) {
        const { width, height } = tooltipNode.getBoundingClientRect();
        const { x, y } = clampPosition(event.pageX, event.pageY, width, height);
        tooltip.style("left", `${x}px`).style("top", `${y}px`);
      }
    }

    event.stopPropagation();
  });

  /* Hover handlers */
  function handleMouseOver(
    this: SVGRectElement,
    event: MouseEvent | KeyboardEvent,
    d: DataItemType,
  ) {
    d3.select(this).transition().duration(200).style("fill", "#ffcd44");

    tooltip
      .classed("hidden", false)
      .html(generateTooltipHTML(d, refuseType, year, getPopulation));

    const tooltipNode = tooltip.node();
    if (!tooltipNode) return;

    const { width, height } = tooltipNode.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      const { x, y } = clampPosition(event.pageX, event.pageY, width, height);
      tooltip.style("left", `${x}px`).style("top", `${y}px`);
    } else {
      const boundingBox = this.getBoundingClientRect();
      const left = boundingBox.left + window.scrollX + 15;
      const top = boundingBox.top + window.scrollY - 40;

      const { x, y } = clampPosition(left, top, width, height);
      tooltip.style("left", `${x}px`).style("top", `${y}px`);
    }
  }

  function handleMouseOut(
    this: SVGRectElement,
    event: MouseEvent,
    d: DataItemType,
  ) {
    d3.select(this)
      .transition()
      .duration(200)
      .style("fill", colorBars(d.borough) as string);

    tooltip.classed("hidden", true);
  }

  function handleMouseMove(event: MouseEvent) {
    const tooltipNode = tooltip.node();
    if (!tooltipNode) return;

    const { width, height } = tooltipNode.getBoundingClientRect();
    const { x, y } = clampPosition(
      event.pageX + 15,
      event.pageY - 20,
      width,
      height,
    );

    tooltip.style("left", `${x}px`).style("top", `${y}px`);
  }

  g.on("mouseout", () => {
    tooltip.classed("hidden", true);
  });

  /* Bar Labels */
  g.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .style("opacity", 0)
    .attr("class", "label")
    .text(
      (d: DataItemType) =>
        new Intl.NumberFormat().format(poundsPerPerson(d)) + " lbs/person",
    )
    .attr("y", (d) => yScale(d.boroughDistrict)! + 20)
    .attr("x", (d) => xScale(poundsPerPerson(d)) + 5)
    .style("opacity", 1);

  g.selectAll("rect").data(data).exit().transition().duration(500).remove();
}
