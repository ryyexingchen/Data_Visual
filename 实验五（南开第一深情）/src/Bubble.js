"use strict";
import * as d3 from "d3";

function Color(data) {
  switch (data.MaxIntensity) {
    case 6:
      return "#808080";
    case 8:
      return "#00AAFF";
    case 10:
      return "#0041FF";
    case 12:
      return "#FF74D5";
    case 15:
      return "#FFE600";
    case 18:
      return "#FF9900";
    case 21:
      return "#FF2800";
    case 23:
      return "#A50021";
    case 28:
      return "purple";
    default:
      return "white";
  }
}

function Opacity(data) {
  switch (data.MaxIntensity) {
    case 6:
      return "0.3";
    case 8:
      return "0.2";
    case 10:
      return "0.2";
    case 12:
      return "0.4";
    case 15:
      return "0.6";
    case 18:
      return "0.5";
    case 21:
      return "0.4";
    case 23:
      return "0.4";
    case 28:
      return "0.4";
    default:
      return "0";
  }
}

function ClassName(data) {
  switch (data.MaxIntensity) {
    case 6:
      return "class1";
    case 8:
      return "class2";
    case 10:
      return "class3";
    case 12:
      return "class4";
    case 15:
      return "class5";
    case 18:
      return "class6";
    case 21:
      return "class7";
    case 23:
      return "class8";
    case 28:
      return "class9";
    default:
      return "0";
  }
}

function chart(
  data,
  {
    marginTop = 20, //以像素为单位的上边距
    marginRight = 30, //以像素为单位的右边距
    marginBottom = 30, //以像素为单位的下边距
    marginLeft = 60, //以像素为单位的左边距
    width = 1600, //以像素为单位的外表宽
    height = 1000, //以像素为单位的外表高
  } = {}
) {
  var svg = d3.select("#chart").attr("width", width).attr("height", height);
  // 创建比例尺
  var xScale = d3
    .scalePow()
    .exponent(1.2)
    .domain([0, d3.max(data, (d) => d.Magnitude) + 0.45])
    .range([marginLeft, 0.85 * width]);
  var yScale = d3
    .scalePow()
    .exponent(0.3)
    .domain([
      d3.min(data, (d) => d.Depth) - 0.15,
      d3.max(data, (d) => d.Depth) + 50,
    ])
    .range([marginLeft, height]);
  // 创建坐标轴
  var xAxis = d3.axisTop(xScale);
  var yAxis = d3.axisLeft(yScale);
  // 在坐标轴上显示Depth和Magnitude
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", 0.86 * width)
    .attr("y", marginTop)
    .style("text-anchor", "begin")
    .text("Magnitude");
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", 10)
    .attr("y", marginTop * 2.75)
    .style("text-anchor", "start")
    .text("Depth");
  // 创建气泡
  var bubbles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", (d) => ClassName(d))
    .attr("cx", (d) => xScale(d.Magnitude))
    .attr("cy", (d) => yScale(d.Depth))
    .attr("r", (d) => d.MaxIntensity)
    .attr("opacity", (d) => Opacity(d))
    .attr("fill", (d) => Color(d));
  svg.append("circle")
  .attr("class", "circle1")
    .attr("cx", 0.85 * width) // 圆心的x坐标
    .attr("cy", 300) // 圆心的y坐标
    .attr("r", 25) // 圆的半径
    .attr("fill", "none") // 不填充颜色
    .attr("stroke", "black") // 圆的边框颜色
    .attr("stroke-width", 2); // 圆的边框宽度
  svg.append("line")
    .attr("x1", 0.85 * width)
    .attr("y1", 300)
    .attr("x2", 0.85 * width + 25)
    .attr("y2", 300)
    .attr("stroke", "black")
    .attr("stroke-width", 2);
  svg.append("text")
    .attr("x", 0.85 * width) // 文本的x坐标
    .attr("y", 255) // 文本的y坐标
    .attr("text-anchor", "middle") // 文本的水平对齐方式为居中
    .text("MaxIntensity"); // 文本内容
  svg.append("text")
    .attr("x", 0.85 * width) // 文本的x坐标
    .attr("y", 350) // 文本的y坐标
    .attr("text-anchor", "middle") // 文本的水平对齐方式为居中
    .text("MaxIntensity"); // 文本内容
  //图例数组，格式可自定义
  var data_legend = [
    { name: "1", color: "#808080" },
    { name: "2 ",color: "#00AAFF" },
    { name: "3 ",color: "#0041FF" },
    { name: "4 ",color: "#FF74D5" },
    { name: "5-",color: "#FFE600" },
    { name: "5+",color: "#FF9900" },
    { name: "6-",color: "#FF2800" },
    { name: "6+",color: "#A50021" },
    { name: "7 ",color: "#A31C67" },
    { name: "ALL ",color: "#black"},
  ];
  var flag = 1;
  var flag1 = 0;
  var flag2 = 0;
  var flag3 = 0;
  var flag4 = 0;
  var flag5 = 0;
  var flag6 = 0;
  var flag7 = 0;
  var flag8 = 0;
  var flag9 = 0;
  //初始化图例，将data_legend与图例绑定
  var legend = svg.selectAll(".legend")
    .data(data_legend)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d,i) => `translate(80,${i * 20 + 30})`); //transform属性是整个图例的坐标
  //绘制文字后方的颜色框或线
  legend.append("rect")
    .attr("x", width * 0.8 - 25) //width是svg的宽度，x属性用来调整位置
    .attr("y", 8)
    .attr("width", 40)
    .attr("height", 18) //设低一些就是线，高一些就是面，很好理解
    .on("click", function (d) {
      var selectedColor = d3.select(this).style("fill");
      if (flag) {
        svg.selectAll("circle").attr("opacity", 0);
        flag = 0;
      }
      if (selectedColor === "rgb(128, 128, 128)") {
        flag1 = !flag1;
        if (flag1 == 1)
          svg.selectAll(".class1").attr("opacity", 0.7);
        else
          svg.selectAll(".class1").attr("opacity", 0);
      } else if (selectedColor === "rgb(0, 170, 255)") {
        flag2 = !flag2;
        if (flag2)
          svg.selectAll(".class2").attr("opacity", 0.7);
        else
          svg.selectAll(".class2").attr("opacity", 0);
      } else if (selectedColor === "rgb(0, 65, 255)") {
        flag3 = !flag3;
        if (flag3)
          svg.selectAll(".class3").attr("opacity", 0.7);
        else
          svg.selectAll(".class3").attr("opacity", 0);
      } else if (selectedColor === "rgb(255, 116, 213)") {
        flag4 = !flag4;
        if (flag4)
          svg.selectAll(".class4").attr("opacity", 0.7);
        else
          svg.selectAll(".class4").attr("opacity", 0);
      } else if (selectedColor === "rgb(255, 230, 0)") {
        flag5 = !flag5;
        if (flag5)
          svg.selectAll(".class5").attr("opacity", 0.7);
        else
          svg.selectAll(".class5").attr("opacity", 0);
      } else if (selectedColor === "rgb(255, 153, 0)") {
        flag6 = !flag6;
        if (flag6)
          svg.selectAll(".class6").attr("opacity", 0.7);
        else
          svg.selectAll(".class6").attr("opacity", 0);
      } else if (selectedColor === "rgb(255, 40, 0)") {
        flag7 = !flag7;
        if (flag7)
          svg.selectAll(".class7").attr("opacity", 0.7);
        else
          svg.selectAll(".class7").attr("opacity", 0);
      } else if (selectedColor === "rgb(165, 0, 33)") {
        flag8 = !flag8;
        if (flag8)
          svg.selectAll(".class8").attr("opacity", 0.7);
        else
          svg.selectAll(".class8").attr("opacity", 0);
      } else if (selectedColor === "rgb(163, 28, 103)") {
        flag9 = !flag9;
        if (flag9)
          svg.selectAll(".class9").attr("opacity", 0.7);
        else
          svg.selectAll(".class9").attr("opacity", 0);
        
      } else {
        flag = 1;
        flag1 = 0;
        flag2 = 0;
        flag3 = 0;
        flag4 = 0;
        flag5 = 0;
        flag6 = 0;
        flag7 = 0;
        flag8 = 0;
        flag9 = 0;
        svg.selectAll(".class1").attr("opacity", 0.3);
        svg.selectAll(".class2").attr("opacity", 0.2);
        svg.selectAll(".class3").attr("opacity", 0.2);
        svg.selectAll(".class4").attr("opacity", 0.4);
        svg.selectAll(".class5").attr("opacity", 0.6);
        svg.selectAll(".class6").attr("opacity", 0.5);
        svg.selectAll(".class7").attr("opacity", 0.4);
        svg.selectAll(".class8").attr("opacity", 0.4);
        svg.selectAll(".class9").attr("opacity", 0.4);
      }
      svg.select(".circle1").attr("opacity", 1);
    })
    .style("fill", (d) => d.color).attr("opacity", 1);
  //绘制图例文字
  legend.append("text")
    .attr("x", width * 0.8 - 53)
    .attr("y", 22)
    .style("text-anchor", "start") //样式对齐
    .text((d) => d.name);
  //绘制x轴
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${marginTop})`)
    .call(xAxis)
    .call(xAxis.ticks(width / 200))
    .call((g) =>
      g.selectAll(".tick line")
        .clone()
        .attr("y2", 960)
        .attr("stroke-opacity", 0.1)
    );
  //绘制y轴
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(yAxis.ticks(height / 50))
    .call((g) =>
      g.selectAll(".tick line")
        .clone()
        .attr("x2", 1226)
        .attr("stroke-opacity", 0.1)
    );
  return svg.node();
}

export default chart;
