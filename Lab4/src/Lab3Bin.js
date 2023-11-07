import * as d3 from "d3";

function bin(data,{
    marginTop = 30, //以像素为单位的上边距
    marginRight = 30, //以像素为单位的右边距
    marginBottom = 30, //以像素为单位的下边距
    marginLeft = 140, //以像素为单位的左边距
    width = 1370, //以像素为单位的外表宽
    height = 410, //以像素为单位的外表高
    Colors = ["#6cf","green","orange","red","brown"], //颜色属性，为一个向量
    xDomain,
    yDomain,
    xRange = [marginLeft, width - marginRight - 100],
    yRange = [height - marginBottom, marginTop],
    Keys = ["Round1","Round2","Round3","Round4","Round5"]
} = {}){
    //定义stack对象用于存放数据
    let series = d3.stack()
                .offset(d3.stackOffsetDiverging)
                .keys(Keys)
                .order(d3.stackOrderAppearance)(data);
    //console.log(series);

    const sortby = d => (a,b)=>(a[d]-b[d]);//数组排序方法，d代表属性名
    let sumMax = [];
    //将所有人对于总成绩进行排序
    for(let i = 0;i < 8;i++){
      sumMax.push({name:series[0][i].data.Name,max:series[4][i][1],difficulty:series[0][i].data.Difficulty});
    }
    sumMax.sort(sortby('max'));

    if (xDomain === undefined) xDomain = [0, d3.max(series,d => d3.max(d,subp => subp[1]))];//x定义域，后一项的意思是去整个stack中的最大值
    if (yDomain === undefined){
      yDomain = [];
      for(let i = 0;i < 8;i++){
        yDomain.push(sumMax[i].name);
      }
    } 
    
    const xScale = d3.scaleLinear(xDomain,xRange);//x轴
    const xAxis = d3.axisBottom(xScale);
    const yScale= d3.scaleBand(yDomain,yRange).padding(0.08);//y轴
    const yAxis = d3.axisLeft(yScale);
    const x2Scale = d3.scaleLinear([2,3.5],xRange);
    const x2Axis = d3.axisTop(x2Scale);

    const color = d3.scaleOrdinal()//颜色映射
                    .domain(series.map(d => d.key))
                    .range(Colors);

    //开始绘制图像
    const svg = d3.select("#lab3bin")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
    .selectAll()
    .data(series)
    .join("g")
      .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => xScale(d[0]))
      .attr("y", d =>yScale(d.data.Name))
      .attr("height", yScale.bandwidth())
      .attr("width", d => xScale(d[1]) - xScale(d[0]))
    
    //渲染Difficulty点
    svg.append("g")
      .attr("stroke", "black")
    .selectAll("circle")
    .data(d => data.map(d =>({name: d.Name,difficulty:d.Difficulty})))
    .join("circle")
      .attr("cx", d => x2Scale(d.difficulty))
      .attr("cy", d => (yScale(d.name) + yScale.bandwidth() / 2))
      .attr("r","3")
      .attr("fill","black");
    
    //渲染Difficulty标签
    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
    .selectAll()
    .data(d => data.map(d =>({name: d.Name,difficulty:d.Difficulty})))
    .join("text")
      .attr("transform", d => `translate(${x2Scale(d.difficulty) + 1},${yScale(d.name) + yScale.bandwidth() / 2})`)
      .attr("fill-opacity", 0)
      .text(d => d.difficulty)
        .attr("stroke", "black")
        .attr("paint-order", "stroke")
        .attr("fill", "currentColor")
        .attr("dx", "0.8em").attr("dy", "0.32em").attr("text-anchor", "start");
        

    //渲染x轴
    svg.append('g')
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis.ticks(width / 100))
      .call(g => g.selectAll(".tick line").clone()
          .attr("y2", -height + marginTop + marginBottom)
          .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
          .attr("x", (width - 100) / 2 - 10)
          .attr("y", marginBottom)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("← Point →"));

    svg.append('g')
    .attr("transform", `translate(0,${marginTop})`)
    .call(x2Axis.ticks(width / 100))
    .call(g => g.append("text")
          .attr("x", (width - 100) / 2 - 10)
          .attr("y", -20)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("← Difficulty →"));


    //渲染y轴
    svg.append('g')
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.append("text")
        .attr("x", -55)
        .attr("y", 20)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↓ Name"));

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
                    .attr("transform", (d, i) => "translate(-30," + (i * 20 + 30) + ")"); 
    //绘制文字后方的颜色框
    legend.append("rect")
          .attr("x", (width / 160) * 157)  
          .attr("y", 3)
          .attr("width", 40)
          .attr("height", 15)
          .attr("opacity",0.75)
          .style("fill", d => d.color);
    //绘制Difficulty的图例
    svg.append("circle")
        .attr("cx", (width / 160) * 157)  
        .attr("cy", 150)
        .attr("r",3)
        .attr("fill","black");

    svg.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("transform", d => `translate(${(width / 160) * 157 + 1},150)`)
        .attr("fill-opacity", 0)
        .text("3.2")
        .attr("stroke", "black")
        .attr("paint-order", "stroke")
        .attr("fill", "currentColor")
        .attr("dx", "0.8em").attr("dy", "0.32em").attr("text-anchor", "start");

    //绘制图例文字
    legend.append("text")
          .attr("x", (width / 40) * 39)
          .attr("y", 15)
          .style("text-anchor", "end") //样式对齐
          .text(d => d.name);

    svg.append("text")
    .attr("x", (width / 40) * 39)
    .attr("y", 154)
    .style("text-anchor", "end")
    .text("Average Difficulty");

     return svg.node();
}

export default bin;