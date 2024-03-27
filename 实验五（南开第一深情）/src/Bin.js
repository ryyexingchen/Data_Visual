import * as d3 from "d3";

let originalData;

//图例
function addLegend(svg, colorScale, marginLeft, marginTop) {
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${marginLeft},${marginTop})`);

  const legendGroups = legend.selectAll(".legend-entry")
    .data(colorScale.domain())
    .join("g")
    .attr("class", "legend-entry")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendGroups.append("rect")
    .attr("x", 0)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", d => colorScale(d));

  legendGroups.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .attr("dy", "0.35em")
    .text(d => {
      const descriptions = {
        '1': 'MaxIntensity 1',
        '2': 'MaxIntensity 2',
        '3': 'MaxIntensity 3',
        '4': 'MaxIntensity 4',
        'A': 'MaxIntensity 5-',
        'B': 'MaxIntensity 5+',
        'C': 'MaxIntensity 6-',
        'D': 'MaxIntensity 6+',
        '7': 'MaxIntensity 7',
      }
      return descriptions[d];
    });
}

function StackedBarChart(data, {
  keys,
  xLabel, 
  yLabel, 
  width = 1000,
  height = 600,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 140,
} = {}) {

// 保存原始数据
if (!originalData) {
  originalData = data.map(d => ({ ...d }));
}

const stack = d3.stack().keys(keys);
const stackedData = stack(data);
  // 创建比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Year)) 
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .nice()
    .range([height - marginBottom, marginTop]);

    const colorScale = d3.scaleOrdinal()
    .domain(['1', '2', '3', '4', 'A', 'B', 'C', 'D', '7'])
    .range(['#808080', '#00AAFF', '#0041FF', '#FAE696', '#FFE600', '#FF9900', '#FF2800', '#A50021', '#B40068']);

  // 创建 SVG 容器
  const svg = d3.select("#bin")
    .attr("width", width)
    .attr("height", height);

  // 绘制矩形
  svg.selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d =>xScale(d.data.Year))
    .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .append("title")
        .text(d => `${d.data.Year} - ${d[1] - d[0]}`);

  //x轴
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .call(g => g.append("text")
      .attr("x", width - marginRight)
      .attr("y", marginTop)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text(xLabel));

  //y轴
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).tickSizeOuter(0))
    .call(g => g.append("text")
      .attr("x", -marginTop)
      .attr("y", -marginLeft)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(yLabel)
      .attr("transform", "rotate(-90)"));

  //图例
  addLegend(svg, colorScale, width - marginRight - 200, marginTop + 20);

  const select = d3.select("#filter-dropdown")
    .append("select")
    .on("change", function () {
      const selectedCategory = d3.select(this).property("value");
      if (selectedCategory === "reset") {
        redrawChart(originalData);
      } else {
        const filteredData = data.map(d => ({
          Year: d.Year,
          [selectedCategory]: d[selectedCategory]
        }));
        redrawChart(filteredData);
      }
    });

  select.append("option")
    .attr("value", "reset")
    .text("ALL");

  select.selectAll("option.filter-option")
    .data(keys.slice(0))
    .enter().append("option")
    .attr("value", d => d)
    .attr("class", "filter-option")
    .text(d => {
      const descriptions = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        'A': '5-',
        'B': '5+',
        'C': '6-',
        'D': '6+',
        '7': '7',
      }
      return descriptions[d];
    });

  function redrawChart(filteredData) {
    const stack = d3.stack().keys(keys.slice(0));
    const stackedData = stack(filteredData);
    // 重新计算 Y 轴的最大值
  const maxY = d3.max(stackedData, d => d3.max(d, d => d[1]));
  // 更新 Y 轴的比例尺
  yScale.domain([0, maxY]).nice();
  // 更新 Y 轴
  svg.select("g.y-axis")
    .transition()
    .call(d3.axisLeft(yScale).tickSizeOuter(0))
    .call(g => g.select(".y-axis-label")
    .text(yLabel)); // 更新 Y 轴标签

    svg.selectAll("g").remove();

    svg.selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => xScale(d.data.Year))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .append("title")
      .text(d => `${d.data.Year} - ${d[1] - d[0]}`);

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .call(g => g.append("text")
        .attr("x", width - marginRight)
        .attr("y", marginTop)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(xLabel));

        svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0))
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -marginTop)
        .attr("y", -marginLeft)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
        .attr("transform", "rotate(-90)");

    addLegend(svg, colorScale, width - marginRight - 200, marginTop + 20);
  }

  return svg.node();
}

export default StackedBarChart;