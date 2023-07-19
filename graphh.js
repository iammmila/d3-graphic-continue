const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
// ! Selections
const selectSector = d3.select("#sector");
const selectSubsector = d3.select("#subsector");
const selectIndicator = d3.select("#indicator");

//! Country -multiple choices
const containerCountry = d3.select(".container");
const selectBtnCountry = d3.select(".select-btn");
const listItemsCountry = d3.select(".list-items");
const itemsCountry = d3.selectAll(".item");

// !selection year (we can choose only bothb of these years)
const containerYear = d3.select(".container-year");
const selectBtnYear = d3.select(".select-btn-year");
const listItemsYear = d3.select(".list-items-year");
const itemsYear = d3.selectAll(".item-year");

const http = "https://restcountries.com/v3.1/all";
//!table
const secondSection = d3.select(".second-section");

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

//! fethcing data
d3.csv("./data.csv")
  .then(function (data) {
    data.forEach(function (d) {
      d.Year = String(d.Year);
      d.Rank = +d.Rank;
    });

    // multiple selected countries tracking
    let selectedCountries = [];
    let selectedYears = [];

    //! selections' datas
    const Countries = [...new Set(data.map((d) => d.Country))];
    const Sectors = [...new Set(data.map((d) => d.Sector))];
    const Subsector = [...new Set(data.map((d) => d.Subsector))];
    const Indicator = [...new Set(data.map((d) => d.Indicator))];
    const Amounts = [...new Set(data.map((d) => d.Amount))];
    const Years = [...new Set(data.map((d) => d.Year))];

    //! selections' options
    selectBtnCountry
      .append("span")
      .classed("btn-text", true)
      .text("Select Multiple Choices");
    selectBtnCountry.on("click", function () {
      // Toggle the display of listItems
      const display = listItemsCountry.style("display");
      if (display === "none") {
        listItemsCountry.style("display", "block");
        selectBtnCountry.attr("class", "select-btn open");
      } else {
        listItemsCountry.style("display", "none");
        selectBtnCountry.attr("class", "select-btn");
      }
    });

    selectBtnCountry
      .append("span")
      .classed("arrow-dwn", true)
      .append("i")
      .classed("fa-solid fa-chevron-down", true);

    const listItemsCountry = containerCountry
      .append("ul")
      .classed("list-items", true);

    const listItemCountry = listItemsCountry
      .selectAll(".item")
      .data(Countries)
      .enter()
      .append("li")
      .classed("item", true);

    listItemCountry
      .append("span")
      .classed("checkbox", true)
      .append("i")
      .classed("fa-solid fa-check check-icon", true);

    listItemCountry
      .append("span")
      .classed("item-text", true)
      .text((d) => (d ? d : "nothing"));

    selectBtnYear
      .append("span")
      .classed("btn-text-year", true)
      .text("Select Multiple Choices");
    selectBtnYear.on("click", function () {
      // Toggle the display of listItems
      const display = listItemsYear.style("display");
      if (display === "none") {
        listItemsYear.style("display", "block");
        selectBtnYear.attr("class", "select-btn-year open-year");
      } else {
        listItemsYear.style("display", "none");
        selectBtnYear.attr("class", "select-btn-year");
      }
    });
    selectBtnYear
      .append("span")
      .classed("arrow-dwn-year", true)
      .append("i")
      .classed("fa-solid fa-chevron-down", true);

    const listItemsYear = containerYear
      .append("ul")
      .classed("list-items-year", true);

    const listItemYear = listItemsYear
      .selectAll(".item-year")
      .data(Years.sort())
      .enter()
      .append("li")
      .classed("item-year", true);

    listItemYear
      .append("span")
      .classed("checkbox-year", true)
      .append("i")
      .classed("fa-solid fa-check check-icon", true);

    listItemYear
      .append("span")
      .classed("item-text-year", true)
      .text((d) => (d ? d : "nothing"));

    const optionsOfSectors = selectSector
      .selectAll("option")
      .data(["", ...Sectors])
      .enter()
      .append("option")
      .text((d) => (d ? d : "select sectors"))
      .attr("value", (d) => d);

    const optionsOfSubsectors = selectSubsector
      .selectAll("option")
      .data(["", ...Subsector])
      .enter()
      .append("option")
      .text((d) => (d ? d : "select subsector"))
      .attr("value", (d) => d);

    const optionsOfIndicators = selectIndicator
      .selectAll("option")
      .data(["", ...Indicator])
      .enter()
      .append("option")
      .text((d) => (d ? d : "select indicator"))
      .attr("value", (d) => d);

    //!table's data
    const lists = d3
      .select(".table-lists")
      .selectAll(".lists")
      .data(Countries)
      .enter()
      .append("li")
      .classed("lists", true);

    // Create the elements within each list item
    lists
      .append("div")
      .classed("name-country", true)
      .text((d) => d);

    lists
      .append("div")
      .classed("icon-country", true)
      .text((d) => d);

    lists
      .append("div")
      .classed("amount-country", true)
      .text((d, i) => Amounts[i]);
    // Define the color scale
    const colorScales = d3.scaleOrdinal(d3.schemeCategory10);

    // Set the domain of the x and y scales
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

    // extract the unique country names
    const countries = [...new Set(data.map((d) => d.Country))];
    //!fetching countries
    countries.forEach(function (country, index) {
      // Filter the data for the current country
      const filteredData = data.filter(function (d) {
        return d.Country === country;
      });

      function updatedGraph() {
        const selectedSector = selectSector.property("value");
        const selectedSubsector = selectSubsector.property("value");
        const selectedIndicator = selectIndicator.property("value");

        let filteredData = data;
        const filteredCountries = [
          ...new Set(filteredData.map((d) => d.Country)),
        ];
        if (selectedCountries.length > 0) {
          filteredData = filteredData.filter((d) =>
            selectedCountries.includes(d.Country)
          );
        }
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
        }

        // Clear the previous graph
        svg.selectAll("path").remove();

        filteredCountries.forEach(function (country, index) {
          const countryData = filteredData.filter((d) => d.Country === country);
          // Create the line generator for the current country

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
            .attr("stroke", colorScales(index))
            .attr("stroke-width", 3)
            .attr("d", line);
        });
      }
      updatedGraph();

      // !selection of country  - onClick
      listItemCountry.on("click", function () {
        const item = d3.select(this);
        const country = item.text();
        const isChecked = item.classed("checked");
        if (isChecked) {
          item.classed("checked", false);
        } else {
          item.classed("checked", true);
        }
        if (!isChecked) {
          selectedCountries.push(country);
        } else {
          selectedCountries = selectedCountries.filter((c) => c !== country);
        }
        updatedGraph();
      });

      // !selection of year  - onClick
      listItemYear.on("click", function () {
        const item = d3.select(this);
        const year = item.text();
        const isChecked = item.classed("checked");
        if (isChecked) {
          item.classed("checked", false);
        } else {
          item.classed("checked", true);
        }
        if (!isChecked) {
          selectedYears.push(year);
        } else {
          selectedYears = selectedYears.filter((c) => c !== year);
        }
        // updatedGraph();
      });

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Add the y-axis
      svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
      // countryCheckboxes.on("change", updatedGraph);
      selectSector.on("change", updatedGraph);
      selectSubsector.on("change", updatedGraph);
      selectIndicator.on("change", updatedGraph);
    });
    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append("g").call(d3.axisLeft(y));
  })
  .catch((error) => console.log("error:", error));
