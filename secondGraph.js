// !selection year (we can choose only bothb of these years)
const secondSection = d3.select(".second-section");
const containerYear = d3.select(".container-year");
const selectBtnYear = d3.select(".select-btn-year");
const listItemsYear = d3.select(".list-items-year");
const itemsYear = d3.selectAll(".item-year");

const firstYearSelection = d3.select("#firstYear");
const secondYearSelection = d3.select("#secondYear");
// api - countries
async function fetchCountryFlag(country) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    const data = await response.json();
    const flag = data[0].flags.svg;
    return flag;
  } catch (error) {
    console.log("Error fetching country flag:", error);
    return null;
  }
}

//! fethcing data
d3.csv("./data.csv")
  .then(function (data) {
    //! selections' datas
    const Countries = [...new Set(data.map((d) => d.Country))];
    const Amounts = [...new Set(data.map((d) => d.Amount))];
    const Years = [...new Set(data.map((d) => d.Year))];

    const optionsOfFirstYear = firstYearSelection
      .selectAll("option")
      .data(["", ...Years.sort()])
      .enter()
      .append("option")
      .text((d) => (d ? d : "First Year"))
      .attr("value", (d) => d);

    const optionsOfSecondYear = secondYearSelection
      .selectAll("option")
      .data(["", ...Years.sort()])
      .enter()
      .append("option")
      .text((d) => (d ? d : "Second Year"))
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
    const firstCountry = lists
      .append("div")
      .classed("first-country", true)
      .append("span")
      .text((d) => d);

    firstCountry
      .append("div")
      .classed("icon-country", true)
      .each(async function (country) {
        const flagUrl = await fetchCountryFlag(country);
        if (flagUrl) {
          d3.select(this).html(`<img src="${flagUrl}" alt="${country}" />`);
        } else {
          d3.select(this).text("N/A");
        }
      });

    const secondDifference = lists
      .append("div")
      .classed("second-difference", true);

    secondDifference
      .append('div')
      .classed("amount-image", true)
      .text((d, i) => Amounts[i]);

    secondDifference.append("span").text((d) => d);

    const thirdMeaning = lists
      .append("div")
      .classed("third-meaning", true)
      .text((d) => d);

    function calculateAmountDifference(
      selectedFirstYear,
      selectedSecondYear,
      country,
      data
    ) {
      let firstYearData = null;
      let secondYearData = null;

      // Find the data entries for the selected years and the given country
      for (const d of data) {
        if (d.Country === country && d.Year === selectedFirstYear) {
          firstYearData = d;
        }
        if (d.Country === country && d.Year === selectedSecondYear) {
          secondYearData = d;
        }
      }

      // Convert "Amount" values to numbers
      const firstAmount = firstYearData
        ? parseFloat(firstYearData.Amount)
        : NaN;
      const secondAmount = secondYearData
        ? parseFloat(secondYearData.Amount)
        : NaN;

      // Calculate the difference between amounts
      if (!isNaN(firstAmount) && !isNaN(secondAmount)) {
        return firstAmount - secondAmount;
      }

      // If data is not available for both selected years, return a default value (you can customize this based on your requirements)
      return "N/A";
    }

    // Event listener for year selection change
    function handleYearSelectionChange() {
      // Get the selected years
      const selectedFirstYear = firstYearSelection.property("value");
      const selectedSecondYear = secondYearSelection.property("value");

      // Update the "amount-country" div for each country
      lists.selectAll(".amount-country").text((country) => {
        const amountDifference = calculateAmountDifference(
          selectedFirstYear,
          selectedSecondYear,
          country,
          data
        );
        return amountDifference !== "N/A"
          ? `Difference: ${amountDifference}`
          : "N/A";
      });
    }

    firstYearSelection.on("change", handleYearSelectionChange);
    secondYearSelection.on("change", handleYearSelectionChange);
    // handleYearSelectionChange();
  })
  .catch((error) => console.log("error:", error));
