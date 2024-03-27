'use strict';
import StackedBarChart from "./Bin.js";
import * as d3 from "d3";
import csv from "./assets/MaxIntensity1.csv";

d3.csv(csv).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    StackedBarChart(data, {
      keys: [ '1', '2', '3', '4', 'A', 'B', 'C', 'D', '7'],
      xLabel: "",
      yLabel: "Count",
    });
  }
});