import * as d3 from "d3";
import image1 from './assets/label_image/1.png';
import image2 from './assets/label_image/2.png';
import image3 from './assets/label_image/3.png';
import image4 from './assets/label_image/4.png';
import imageA from './assets/label_image/A.png';
import imageB from './assets/label_image/B.png';
import imageC from './assets/label_image/C.png';
import imageD from './assets/label_image/D.png';
import image7 from './assets/label_image/7.png';
import earthquakeIcon from './assets/label_image/earthquake.png';

function drawMap(container, geoData, width, height, projectionOptions, pathOptions, observationData, cLatitude, cLongitude) {
  // 创建地理投影
  const projection = d3.geoMercator()
    .center(projectionOptions.center) // 设置地图中心点
    .scale(projectionOptions.scale) // 设置缩放比例
    .translate([width / 2, height / 2])
    .fitSize([width, height], geoData); // 将地图移动到画布中心

  // 创建路径生成器
  const path = d3.geoPath()
    .projection(projection);

  // 创建 SVG 画布
  const svg = d3.select(container)
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lightblue");

  // 定义缩放行为
  const zoom = d3.zoom()
    .scaleExtent([1, 10]) // 设置缩放范围
    .on("zoom", zoomed);

  svg.call(zoom);

  // 创建一个包含地图元素的组
  const g = svg.append("g");

  // 绘制地图
  g.selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", pathOptions.fillColor)
    .style("stroke", pathOptions.strokeColor);

  // 缩放事件处理函数
  function zoomed() {
    g.attr("transform", d3.zoomTransform(this)); // 应用缩放变换到组
  }

// 根据震度对观测数据进行排序
observationData.sort((a, b) => {
  const order = ['1', '2', '3', '4', 'A', 'B', 'C', 'D', '7'];
  return order.indexOf(a.震度) - order.indexOf(b.震度);
});

// 绘制观测点的贴图
g.selectAll(".observation-image")
.data(observationData)
.enter()
.append("image")
.attr("class", "observation-image")
.attr("x", d => projection([d.Longitude, d.Latitude])[0] - 5)
.attr("y", d => projection([d.Longitude, d.Latitude])[1] - 5)
.attr("width", 10)
.attr("height", 10)
.attr("href", d => {
  let temp;
  if (d.震度 === '1') {
    temp = image1;
  } else if (d.震度 === '2') {
    temp = image2;
  } else if (d.震度 === '3') {
    temp = image3;
  }else if (d.震度 === '4') {
    temp = image4;
  } else if (d.震度 === 'A') {
    temp = imageA;
  }else if (d.震度 === 'B') {
    temp = imageB;
  } else if (d.震度 === 'C') {
    temp = imageC;
  } else if (d.震度 === 'D') {
    temp = imageD;
  } else if (d.震度 === '7') {
    temp = image7;
  }
  return temp;
});
 // 绘制震源图标
 const quakeIconSize = 20; 
 g.selectAll(".earthquake-icon")
  .data([{centre_Longitude: cLongitude , centre_Latitude: cLatitude}])
  .enter()
  .append("image")
   .attr("class", "earthquake-icon")
   .attr("x", d => projection([d.centre_Longitude, d.centre_Latitude])[0] - quakeIconSize / 2)
   .attr("y", d => projection([d.centre_Longitude, d.centre_Latitude])[1] - quakeIconSize / 2)
   .attr("width", quakeIconSize)
   .attr("height", quakeIconSize)
   .attr("opacity",0.7)
   .attr("href", earthquakeIcon);
  return svg.node();
}

export default drawMap;
