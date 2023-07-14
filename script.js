// const width = 400;
// const height = 100;

// const data = [10, 15, 20, 25, 30];
// const svg = d3
//   .select("body")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height);

// var scale = d3
//   .scaleLinear()
//   .domain([d3.min(data), d3.max(data)])
//   .range([0, width - 100]);

// // Add scales to axis
// var x_axis = d3.axisBottom().scale(scale);

// //Append group and insert axis
// svg.append("g").call(x_axis);
// chart = {
// Declare the chart dimensions and margins.
// const width = 928;
// const height = 500;
// const marginTop = 20;
// const marginRight = 30;
// const marginBottom = 30;
// const marginLeft = 40;

// aapl = FileAttachment("./data.csv").csv({ typed: true });
// // Declare the x (horizontal position) scale.
// const x = d3.scaleUtc(
//   d3.extent(aapl, (d) => d.Year),
//   [marginLeft, width - marginRight]
// );

// // Declare the y (vertical position) scale.
// const y = d3.scaleLinear(
//   [0, d3.max(aapl, (d) => d.Rank)],
//   [height - marginBottom, marginTop]
// );

// // Declare the line generator.
// const line = d3
//   .line()
//   .x((d) => x(d.Year))
//   .y((d) => y(d.Rank));

// // Create the SVG container.
// const svg = d3
//   .create("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .attr("viewBox", [0, 0, width, height])
//   .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

// // Add the x-axis.
// svg
//   .append("g")
//   .attr("transform", `translate(0,${height - marginBottom})`)
//   .call(
//     d3
//       .axisBottom(x)
//       .ticks(width / 80)
//       .tickSizeOuter(0)
//   );

// // Add the y-axis, remove the domain line, add grid lines and a label.
// svg
//   .append("g")
//   .attr("transform", `translate(${marginLeft},0)`)
//   .call(d3.axisLeft(y).ticks(height / 40))
//   .call((g) => g.select(".domain").remove())
//   .call((g) =>
//     g
//       .selectAll(".tick line")
//       .clone()
//       .attr("x2", width - marginLeft - marginRight)
//       .attr("stroke-opacity", 0.1)
//   )
//   .call((g) =>
//     g
//       .append("text")
//       .attr("x", -marginLeft)
//       .attr("y", 10)
//       .attr("fill", "currentColor")
//       .attr("text-anchor", "start")
//       .text("↑ Daily close ($)")
//   );

// Plot.plot({
//   y: { grid: true, label: "Daily close ($)" },
//   marks: [
//     Plot.ruleY([0]),
//     Plot.lineY(aapl, { x: "date", y: "close", stroke: "steelblue" }),
//   ],
// });
// // Append a path for the line.
// svg
//   .append("path")
//   .attr("fill", "none")
//   .attr("stroke", "steelblue")
//   .attr("stroke-width", 1.5)
//   .attr("d", line(aapl));

// return svg.node();
// // }
