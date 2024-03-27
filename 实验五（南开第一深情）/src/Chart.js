"use strict";
import * as d3 from "d3";

function Color(data, data2, data3) {
  return "rgb(" + data + "," + data2 + "," + data3 + ")";
}
function chart(
  data,
  idname,
  {
    marginTop = 20, //以像素为单位的上边距
    marginRight = 30, //以像素为单位的右边距
    marginBottom = 10, //以像素为单位的下边距
    marginLeft = 30, //以像素为单位的左边距
    width = 600, //以像素为单位的外表宽
    height = 550, //以像素为单位的外表高
  } = {}
) {
  var svg = d3.select(`#${idname}`)
    .attr("width", width+200)
    .attr("height", height + 50);
  // 创建比例尺
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data, (data) => data.Distance)])
    .range([marginLeft, width]);
  var yScale = d3.scaleLinear()
    .domain([
      d3.max(data, (data) => data.MaxIntensity) + 0.1,
      d3.min(data, (data) => data.MaxIntensity) - 0.1,
    ])
    .range([marginTop, height - marginBottom]);
  // 创建坐标轴
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);
  // 在坐标轴上显示MaxIntensity和Distance
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width + marginRight)
    .attr("y", height)
    .style("text-anchor", "begin")
    .text("Distance(km)");
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", marginLeft + 2)
    .attr("y", marginTop)
    .style("text-anchor", "start")
    .text("MaxIntensity");
  // 创建气泡
  var bubbles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Distance))
    .attr("cy", (d) => yScale(d.MaxIntensity))
    .attr("r", 5)
    .attr("fill", (d) => Color(d.R, d.G, d.B));
  const radius = height / 10; // 圆环半径
  const numColors = 360; // 彩虹环上的颜色数量
  var colors1 = d3.scaleLinear()
    .domain([0, numColors - 1])
    .range([0, 2 * Math.PI]);
  // 创建弧生成器
  const arc = d3.arc()
    .innerRadius(radius - 20)
    .outerRadius(radius)
    .startAngle((d, i) => colors1(i))
    .endAngle((d, i) => colors1(i + 1));

  svg.selectAll("path")
    .data(d3.range(numColors))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("transform", `translate(${width},${height / 6})`)
    .attr("fill", (d, i) => d3.hsl((colors1(-i + 90) * 180) / Math.PI, -1, 0.5)); // 使用对应的颜色填充圆环
  //箭头
  svg.append("line")
    .attr("x1", width - radius)
    .attr("y1", height / 6)
    .attr("x2", width + radius)
    .attr("y2", height / 6)
    .attr("stroke", "black")
    .attr("stroke-width", 2);
  svg.append("line")
    .attr("x1", width)
    .attr("y1", height / 6 - radius)
    .attr("x2", width)
    .attr("y2", height / 6 + radius)
    .attr("stroke", "black")
    .attr("stroke-width", 2);
  svg.append("text")
    .attr("x", width - 8)
    .attr("y", height / 6 - radius - 5)
    .style("text-anchor", "begin")
    .text("北");
  svg.append("text")
    .attr("x", width - 8)
    .attr("y", height / 6 + radius + 15)
    .style("text-anchor", "begin")
    .text("南");
  svg.append("text")
    .attr("x", width + radius+3)
    .attr("y", height / 6+5)
    .style("text-anchor", "begin")
    .text("东");
  svg.append("text")
    .attr("x", width - radius - 19)
    .attr("y", height / 6+5)
    .style("text-anchor", "begin")
    .text("西");
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call(xAxis.ticks(width / 200));
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(yAxis.ticks(height / 50))
    .call((g) =>
      g.selectAll(".tick line")
        .clone()
        .attr("x2", width - marginRight)
        .attr("stroke-opacity", 0.1)
    );
  return svg.node();
}

export default chart;
