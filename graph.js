const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const selectCountry = d3.select("#country");
const selectSector = d3.select("#sector");
const selectSubsector = d3.select("#subsector");
const selectIndicator = d3.select("#indicator");

// Set up the x and y scales
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Create the SVG element and append it to the chart container
const svg = d3
  .select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let Dataaa;
// Load the dataset from the CSV file
d3.csv("./data.csv")
  .then(function (data) {
    Dataaa = data;
    data.forEach(function (d) {
      d.Year = String(d.Year);
      d.Rank = +d.Rank;
    });
    const Countries = [...new Set(data.map((d) => d.Country))];
    const Sectors = [...new Set(data.map((d) => d.Sector))];
    const Subsector = [...new Set(data.map((d) => d.Subsector))];
    const Indicator = [...new Set(data.map((d) => d.Indicator))];

    const optionsOfCountries = selectCountry
      .selectAll("option")
      .data(Countries)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);

    const optionsOfSectors = selectSector
      .selectAll("option")
      .data(Sectors)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);

    const optionsOfSubsectors = selectSubsector
      .selectAll("option")
      .data(Subsector)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);

    const optionsOfIndicators = selectIndicator
      .selectAll("option")
      .data(Indicator)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);
    // Define the color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // Extract the unique country names
    const countries = [...new Set(data.map((d) => d.Country))];
    // Iterate over each country
    x.domain(
      d3.extent(data, function (d) {
        return new Date(d.Year);
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.Rank;
      }),
    ]);

    countries.forEach(function (country, i) {
      // Filter the data for the current country
      const filteredData = data.filter(function (d) {
        return d.Country === country;
      });

      function updateGraph() {
        const selectedSector = selectSector.property("value");
        const selectedSubsector = selectSubsector.property("value");
        const selectedIndicator = selectIndicator.property("value");
        let filteredData = data;
        const filteredCountries = [
          ...new Set(filteredData.map((d) => d.Country)),
        ];

        if (selectedSector) {
          filteredData = filteredData.filter(
            (d) => d.Sector === selectedSector
          );
        }
        if (selectedSubsector) {
          filteredData = filteredData.filter(
            (d) => d.Subsector === selectedSubsector
          );
        }
        if (selectedIndicator) {
          filteredData = filteredData.filter(
            (d) => d.Indicator === selectedIndicator
          );
        } else {
          filteredData = filteredData;
        }

        // Clear the previous graph
        svg.selectAll("path").remove();

        // Update the graph with the filtered data
        filteredCountries.forEach(function (country, i) {
          const countryData = filteredData.filter((d) => d.Country === country);
          const line = d3
            .line()
            .x(function (d) {
              return x(new Date(d.Year));
            })
            .y(function (d) {
              return y(d.Rank);
            });

          // Update the x-axis
          svg.select(".x-axis").call(d3.axisBottom(x));

          // Update the y-axis
          svg.select(".y-axis").call(d3.axisLeft(y));

          svg
            .append("path")
            .datum(countryData)
            .attr("fill", "none")
            .attr("stroke", colorScale(i))
            .attr("stroke-width", 3)
            .attr("d", line);
        });
      }

      updateGraph();
      // Add the x-axis
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Add the y-axis
      svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

      selectSector.on("change", updateGraph);
      selectSubsector.on("change", updateGraph);
      selectIndicator.on("change", updateGraph);
    });

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append("g").call(d3.axisLeft(y));
  })
  .catch(function (error) {
    console.log("Error:", error);
  });