import * as d3 from "d3";

function chart(data,{
    marginTop = 20, //以像素为单位的上边距
    marginRight = 30, //以像素为单位的右边距
    marginBottom = 30, //以像素为单位的下边距
    marginLeft = 40, //以像素为单位的左边距
    width = 1370, //以像素为单位的外表宽
    height = 400, //以像素为单位的外表高
    Colors = ["red","green","orange","#6cf","brown"], //颜色属性，为一个向量
    xDomain,
    yDomain,
    xRange = [marginLeft, width - marginRight - 140],
    yRange = [height - marginBottom, marginTop],
    Keys = ["Class","SelfLearning","Entertainment","Sleeping","Others"]
} = {}){
    //定义stack对象用于存放数据
    let series = d3.stack()
                .offset(d3.stackOffsetDiverging)
                .keys(Keys)
                .order(d3.stackOrderAppearance)(data);
    //console.log(series);

    //处理stack类中的数据以达成排序效果
    const sortby = d => (a,b)=>(a[d]-b[d]);//数组排序方法，d代表属性名

    for(let j = 0;j < 7;j++){
      //取出原始数据算出数值间隔
      let timeInterval = [];
      for(let i = 0;i < 5;i++){
        timeInterval.push({interval:series[i][j][1] - series[i][j][0],index:series[i].index});
      }
      //对数值间隔进行排序
      timeInterval.sort(sortby('index'));
      timeInterval.sort(sortby('interval'));
      //console.log(timeInterval);
      //从0开始累加间隔算出新的起点和终点
      let finished = [];
      let sumtemp = 0;
      for(let i = 0;i < 5;i++){
        let temp = sumtemp;
        sumtemp += timeInterval[i].interval;
        finished.push({start:temp,end:sumtemp,index:timeInterval[i].index});
      }
      //console.log(finished);
      //将算好的数据重新放回stack中
      for(let i = 0;i < 5;i++){
        series[finished[i].index][j][0] = finished[i].start;
        series[finished[i].index][j][1] = finished[i].end;
      }
    }

    if (xDomain === undefined) xDomain = [data[0].Date,data[6].Date];//x定义域
    if (yDomain === undefined) yDomain = [0, d3.max(series,d => d3.max(d,subp => subp[1]))];//y定义域，后一项的意思是去整个stack中的最大值
  
    const xScale= d3.scaleUtc(xDomain,xRange).nice();//x轴
    const xAxis = d3.axisBottom(xScale);
    const yScale = d3.scaleLinear(yDomain,yRange);//y轴
    const yAxis = d3.axisLeft(yScale);

    const color = d3.scaleOrdinal()//颜色映射
                    .domain(series.map(d => d.key))
                    .range(Colors);

    const area = d3.area()//区域映射
                    .x(d => xScale(d.data.Date))
                    .y0(d => yScale(d[0]))
                    .y1(d => yScale(d[1]));
    //开始绘制图像
    const svg = d3.select("#chart")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    //渲染上边界
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 0.75)
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("stroke", "black")
      .attr("d", area.lineY1().curve(d3.curveBumpX));
    //渲染下边界
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 0.75)
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("stroke", "black")
      .attr("d", area.lineY0().curve(d3.curveBumpX));
    //渲染图形
    svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
      .attr("fill", d => color(d.key))
      .attr("opacity",0.75)
      .attr("d", area.curve(d3.curveBumpX))
    .append("title")
      .text(d => d.column);
    //渲染x轴
    svg.append('g')
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis.ticks(width / 200))
    .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("y2", -height + marginTop + marginBottom)
          .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
          .attr("x", (width - 130) / 2 - 10)
          .attr("y", marginBottom)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("← Date →"));
    //渲染y轴
    svg.append('g')
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis.ticks(height / 50))
    .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight - 140)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -37)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("Time(h) ↑"));

    //图例数组
    let data_legend = [];
    for(let i = 0;i < 5;i++){
      data_legend.push({name:Keys[i],color:Colors[series[i].index]});
    }
    //console.log(data_legend);

    //初始化图例，将data_legend与图例绑定
    let legend = svg.selectAll(".legend") 
                    .data(data_legend)
                    .enter() 
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(-30," + (i * 20 + 30) + ")"; }); 
    //绘制文字后方的颜色框
    legend.append("rect")
          .attr("x", (width / 160) * 157)  
          .attr("y", 3)
          .attr("width", 40)
          .attr("height", 15)
          .attr("opacity",0.75)
          .style("fill", d => d.color);
    //绘制图例文字
    legend.append("text")
          .attr("x", (width / 40) * 39)
          .attr("y", 15)
          .style("text-anchor", "end") //样式对齐
          .text(d => d.name);
     return svg.node();
}

export default chart;