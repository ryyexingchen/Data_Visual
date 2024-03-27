"use strict";
import chart from "./Chart.js";
import * as d3 from "d3";
import csv2004 from "./assets/output_rgb2004.csv";
import csv2016_1 from "./assets/output_rgb2016_1.csv";
import csv2016_2 from "./assets/output_rgb2016_2.csv";
import csv2018 from "./assets/output_rgb2018.csv";
import csv2011 from "./assets/output_rgb2011.csv";
  d3.csv(csv2004).then((output_rgb2004) => {
    d3.csv(csv2016_1).then((output_rgb2016_1) => {
      d3.csv(csv2016_2).then((output_rgb2016_2) => {
        d3.csv(csv2018).then((output_rgb2018) => {
          d3.csv(csv2011).then((output_rgb2011) => {
            output_rgb2004.forEach((d) => {
              d.MaxIntensity = +d.MaxIntensity;
              d.Distance = +d.Distance;
              d.R = +d.R;
              d.G = +d.G;
              d.B = +d.B;
            });
            output_rgb2016_1.forEach((d) => {
              d.MaxIntensity = +d.MaxIntensity;
              d.Distance = +d.Distance;
              d.R = +d.R;
              d.G = +d.G;
              d.B = +d.B;
            });
            output_rgb2016_2.forEach((d) => {
              d.MaxIntensity = +d.MaxIntensity;
              d.Distance = +d.Distance;
              d.R = +d.R;
              d.G = +d.G;
              d.B = +d.B;
            });
            output_rgb2018.forEach((d) => {
              d.MaxIntensity = +d.MaxIntensity;
              d.Distance = +d.Distance;
              d.R = +d.R;
              d.G = +d.G;
              d.B = +d.B;
            });
            output_rgb2011.forEach((d) => {
              d.MaxIntensity = +d.MaxIntensity;
              d.Distance = +d.Distance;
              d.R = +d.R;
              d.G = +d.G;
              d.B = +d.B;
            });
            chart(output_rgb2004, "chart2004", {});
            chart(output_rgb2016_1, "chart2016_1", {});
            chart(output_rgb2016_2, "chart2016_2", {});
            chart(output_rgb2018, "chart2018", {});
            chart(output_rgb2011, "chart2011", {});
          });
        });
      });
    });
  });
