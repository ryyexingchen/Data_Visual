'use strict';
import drawMap from "./mapDrawer.js";
import * as d3 from "d3";
import Geojson from "./japan_.json";
import opDataCSV2004 from "./assets/op_data20041023.csv";
import opDataCSV2011 from "./assets/op_data20110311.csv";
import opDataCSV2016_1 from "./assets/op_data20160414.csv";
import opDataCSV2016_2 from "./assets/op_data20160416.csv";
import opDataCSV2018 from "./assets/op_data20180906.csv";
import opDataCSV2023 from "./assets/op_data20230505.csv";

// 调用地图绘制函数
const mapWidth = 600;
const mapHeight = 600;
const projectionConfig = {
  center: [0, 0],
  scale: 100,
};
const pathConfig = {
  fillColor: "green",
  strokeColor: "white",
};

d3.csv(opDataCSV2004).then((data2004) => {
  d3.csv(opDataCSV2011).then((data2011) => {
    d3.csv(opDataCSV2016_1).then((data2016_1) => {
      d3.csv(opDataCSV2016_2).then((data2016_2) => {
        d3.csv(opDataCSV2018).then((data2018) => {
          d3.csv(opDataCSV2023).then((data2023) => {
            drawMap("#map-container2004", Geojson, mapWidth, mapHeight, projectionConfig, pathConfig, data2004,37.28333,138.86667);
            drawMap("#map-container2011", Geojson, mapWidth, mapHeight, projectionConfig, pathConfig, data2011,38.1,142.85);
            drawMap("#map-container2016_1", Geojson, mapWidth, mapHeight, projectionConfig, pathConfig, data2016_1,32.75,130.75);
            drawMap("#map-container2016_2", Geojson, mapWidth, mapHeight, projectionConfig, pathConfig, data2016_2,32.73333,130.8);
            drawMap("#map-container2018", Geojson, mapWidth, mapHeight, projectionConfig, pathConfig, data2018,42.68333,142.00667);
            drawMap("#map-container2023", Geojson, mapWidth, mapHeight, projectionConfig, pathConfig, data2023,37.53833,137.30333);
          })
        })
      })
    })
  })
});
