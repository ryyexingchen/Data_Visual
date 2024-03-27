"use strict";
import chart from "./Bubble.js";
import * as d3 from "d3";
import csv from "./assets/data.csv";

d3.csv(csv).then((data1, error) => {
  if (error) {
    console.log(error);
  } else {
    data1.forEach((d) => {
      d.Depth = +d.Depth;
      d.Magnitude = +d.Magnitude;
      switch (d.MaxIntensity) {
        case "1":
          d.MaxIntensity = 6;
          break;
        case "2":
          d.MaxIntensity = 8;
          break;
        case "3":
          d.MaxIntensity = 10;
          break;
        case "4":
          d.MaxIntensity = 12;
          break;
        case "A":
          d.MaxIntensity = 15;
          break;
        case "B":
          d.MaxIntensity = 18;
          break;
        case "7":
          d.MaxIntensity = 28;
          break;
        case "C":
          d.MaxIntensity = 21;
          break;
        case "D":
          d.MaxIntensity = 23;
          break;
        default:
          d.MaxIntensity = 0;
          break;
      }
    });
    chart(data1, {});
  }
});
