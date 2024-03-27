'use strict';
import * as d3 from "d3";
import Geojson from "./japan_.json"
import csv from "./assets/earthquackList.csv";

function Color(data){
  switch(data.MaxIntensity){
    case(1):
      return "#808080";
    case(2):
      return "#00AAFF";
    case(3):
      return "#0041FF";
    case(4):
      return "#FAE696";
    case(5.5):
      return "#FFD200";
    case(7):
      return "#FF9900";
    case(8.5):
      return "#FF2800";
    case(10):
      return "#A50021";
    case(11.5):
      return "#B40068";
    default:
      return "white";
  }
}

 // 设置画布大小
 var width = 1200;
 var height = 800;
 //初始化动画参数
 const aduraion = 41.667;//设置画面播放间隔，常见的24帧动画应把aduration调为41.667
 const start = 0;//调整开始帧，第3947帧对应2011年3月11日
 var end = 0;//后面会将这个变量改成最后一帧
 var frame = start;//现在播放到第几帧
 var temp_start = 0;
 var temp_end = 0;
 var sequential = [];
 var ju_con = false;
 const btn_restart = document.getElementById('restart');
 const btn_stop = document.getElementById('stop');
 const btn_continue = document.getElementById('continue');
 // 创建地理投影
 var projection = d3.geoMercator()
     .center([0, 0])  // 设置地图中心点
     .scale(100)      // 设置缩放比例
     .translate([width / 2, height / 2])
     .fitSize([width,height],Geojson);  // 将地图移动到画布中心

 // 创建路径生成器
 var path = d3.geoPath()
 .projection(projection);

 // 创建SVG画布
 const svg = d3.select("#map-container")
     .attr("width", width)
     .attr("height", height)
     .attr("fill","steelblue")
     .style("background-color", "lightblue");

 //画图
 svg.append("g")
 .attr("id","maingroup")
 .selectAll("path")
 .data(Geojson.features)
 .enter()
 .append("path")
 .attr("d", path)
 .style("fill", "#DEDEDE")
 .style("stroke", "white");


const renderinit = function(data,seq){ 
  svg.append('g')
  .attr("id","earthquake")
  .selectAll("circle")
  .data(seq)
  .enter()
  .append("circle")
  .attr('opacity',0.9)
  .attr("transform", d => "translate(" + projection([d.Longitude, d.Latitude ]) + ")" )
  .attr("r", d => Math.pow(1.75,d.Magnitude))
  .style("fill", d=>Color(d));

    //添加日期
    svg.append("g")
    .append("text")
    .attr("id","date_text")
    .attr("x",400)
    .attr("y",-250)
    .attr("dy","5em")
    .style("text-anchor","end")
    .attr("fill","#504f4f")
    .attr("font-size","4em")
    .attr("font-weight","bold")
    .text('2000/01/01');

    //添加图例
    const legend = svg.append('g').attr('id','legend');
    const xcCenter = width * 0.95;
    const ycCenter = height / 3 * 2 - 10;

    legend.append('circle')
    .attr("transform", "translate(" + `${xcCenter}` + ","  + `${ycCenter}`  + ")")
    .attr('r',40)
    .attr('fill','lightblue')
    .attr('stroke-width', 2)
    .attr('stroke','red');

    legend.append('circle')
    .attr("transform", "translate(" + `${xcCenter}` + ","  + `${ycCenter}`  + ")")
    .attr('r',2)
    .attr('fill','red')
    .attr('stroke','red');

    legend.append('line')
    .attr('x1',xcCenter)
    .attr('y1',ycCenter)
    .attr('x2',xcCenter + 28)
    .attr('y2',ycCenter - 28)
    .attr('stroke-width', 2)
    .attr('stroke','red');

    legend.append('text')
    .attr("x",xcCenter)
    .attr("y",ycCenter)
    .attr("dy","3.5em")
    .style("text-anchor","middle")
    .attr("fill","black")
    .attr("font-size","1em")
    .text('Magnitude');

    legend.append('rect')
    .attr("x",xcCenter - 53)
    .attr("y",ycCenter + 65)
    .attr("width", 100)
    .attr("height", 205)
    .attr("fill", "white");


    // 矩形图例数据
    var legendData = [
      { color: '#808080', label: '1' },
      { color: '#00AAFF', label: '2' },
      { color: '#0041FF', label: '3' },
      { color: '#FAE696', label: '4' },
      { color: '#FFD200', label: '5-' },
      { color: '#FF9900', label: '5+' },
      { color: '#FF2800', label: '6-' },
      { color: '#A50021', label: '6+' },
      { color: '#B40068', label: '7' }
    ];  
    
    var legends = svg.append('g')
    .selectAll(".legend")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend");

  //绘制文字后方的颜色框或线
  legends
    .append("rect")
    .attr("transform", (d, i) =>"translate(" + `${xcCenter - 10}` + ","  + `${i * 20 + ycCenter + 70}`  + ")")
    .attr("width", 40)
    .attr("height", 15)
    .attr('fill',d => d.color); //设低一些就是线，高一些就是面，很好理解


  //绘制图例文字
  legends
    .append("text")
    .attr("transform", (d, i) =>"translate(" + `${xcCenter - 33}` + ","  + `${i * 20 + ycCenter + 82.5}`  + ")")
    .attr("fill","black")
    .style("text-anchor", "start") //样式对齐
    .text(d => d.label);
  legend.append('text')
    .attr("x",xcCenter)
    .attr("y",ycCenter + 207.5)
    .attr("dy","3.5em")
    .style("text-anchor","middle")
    .attr("fill","black")
    .attr("font-size","1em")
    .text('MaxIntensity');
}

const renderupdate = async function(seq){
  d3.select("#earthquake").remove();
  let transition = d3.transition().duration(aduraion).ease(d3.easeLinear);
  d3.select("#date_text").text(seq[0].Date);
  svg.append('g')
  .attr("id","earthquake")
  .selectAll("circle")
  .data(seq)
  .enter()
  .append("circle")
  .attr('opacity',0.9)
  .attr("transform", d => "translate(" + projection([d.Longitude, d.Latitude ]) + ")")
  .attr("r", d => Math.pow(1.75,d.Magnitude))
  .style("fill", d=>Color(d))
  await transition.end();
}


async function anime(){
  for(;frame < temp_end;frame++){
    await renderupdate(sequential[frame]);
  }
}

d3.csv(csv).then(async data => {
    data.forEach(d => {
        d.Latitude = +(d.LatitudeD) + +(d.LatitudeM) / 60;
        d.Longitude = +(d.LongitudeD) + +(d.LongitudeM) / 60;
        d.Magnitude = +(d.Magnitude);
        switch(d.MaxIntensity){
            case("1"):
                d.MaxIntensity = 1;
                break;
            case("2"):
                d.MaxIntensity = 2;
                break;
            case("3"):
                d.MaxIntensity = 3;
                break;
            case("4"):
              d.MaxIntensity = 4;
              break;
            case("A"):
              d.MaxIntensity = 5.5;
              break;
            case("B"):
              d.MaxIntensity = 7;
              break;
            case("C"):
              d.MaxIntensity = 8.5;
              break;
            case("D"):
              d.MaxIntensity = 10;
              break;
            case("7"):
              d.MaxIntensity = 11.5;
              break;
            default:
              d.MaxIntensity = 0;
              break;
    }})
    var alldates = [];
    alldates = Array.from(new Set(data.map(d => d.Date)));
    alldates = alldates.sort(function(a,b) {
        return new Date(a) - new Date(b);
    });
    alldates.forEach(d => {
        sequential.push([]);
    })
    data.forEach(d => {
        sequential[alldates.indexOf(d.Date)].push(d);
    })
    renderinit(data,sequential[0]);
    end = sequential.length;
    temp_end = end;
    anime();
})

btn_restart.onclick = async function(){
  temp_end = start;//暂停
  frame = start;
  temp_start = start;
  ju_con = true;
  renderupdate(sequential[0]);//调制初始状态
}
btn_stop.onclick = function(){
  temp_start = frame;
  temp_end = frame;
  ju_con = true;
}
btn_continue.onclick = async function(){
  if(ju_con){
    frame = temp_start;
    temp_end = end;
    anime();
    ju_con = false;
  }
}