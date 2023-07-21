// !selection year (we can choose only bothb of these years)
const secondSection = d3.select(".second-section");
const containerYear = d3.select(".container-year");
const listItemsYear = d3.select(".list-items-year");
const itemsYear = d3.selectAll(".item-year");

const firstYearSelection = d3.select("#firstYear");
const secondYearSelection = d3.select("#secondYear");
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
function getSVGIcon(amountDifference) {
  if (amountDifference > 0) {
    return "./svgPosition/positionUp.svg";
  } else if (amountDifference < 0) {
    return "./svgPosition/positionDown.svg";
  } else {
    return "./svgPosition/positionNoChange.svg";
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
      .select(".scrolling")
      .selectAll(".lists")
      .data(Countries)
      .enter()
      .append("li")
      .classed("lists", true);

    // Create the elements within each list item
    const firstCountry = lists.append("div").classed("first-country", true);
    firstCountry.append("span").text((d) => d);

    firstCountry
      .append("div")
      .classed("icon-country", true)
      .each(async function (country) {
        const flagUrl = await fetchCountryFlag(country);
        if (flagUrl) {
          d3.select(this).html(`<img src="${flagUrl}" alt="${country}" />`);
        } else {
          d3.select(this).text("not found");
        }
      });

    const secondDifference = lists
      .append("div")
      .classed("second-difference", true);

    secondDifference.append("div").classed("amount-image", true).text("");

    secondDifference
      .append("span")
      .classed("diff", true)
      .text((d) => d);

    const thirdMeaning = lists
      .append("div")
      .classed("third-meaning", true)
      .text("");

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
        return parseFloat(secondAmount - firstAmount);
      }

      // If data is not available for both selected years, return a default value (you can customize this based on your requirements)
      return "not found";
    }

    // Event listener for year selection change
    function handleYearSelectionChange() {
      // Get the selected years
      const selectedFirstYear = firstYearSelection.property("value");
      const selectedSecondYear = secondYearSelection.property("value");
      // Update the "amount-country" div for each country
      lists.each(function (country) {
        const amountDifference = calculateAmountDifference(
          selectedFirstYear,
          selectedSecondYear,
          country,
          data
        );
        const svgIcon = getSVGIcon(amountDifference);
        const listItem = d3.select(this);

        listItem
          .select(".amount-image")
          .html(`<img src="${svgIcon}" alt="${country}" />`);

        // Set the text for the "third-meaning" class based on the amountDifference
        const thirdMeaning = listItem.select(".third-meaning");

        if (amountDifference > 0) {
          thirdMeaning.text("positions up").style("color", "lightgreen");
          listItem.select(".diff").style("color", "lightgreen");
        } else if (amountDifference < 0) {
          thirdMeaning.text("positions down").style("color", "red");
          listItem.select(".diff").style("color", "red");
        } else if (amountDifference === "not found") {
          thirdMeaning.text("not found").style("color", "orange");
          listItem.select(".diff").style("color", "orange");
        } else {
          thirdMeaning.text("no changes").style("color", "lightgray");
          listItem.select(".diff").style("color", "lightgray");
        }

        listItem
          .select(".diff")
          .text(
            amountDifference !== "not found"
              ? `${amountDifference}`
              : "not found"
          );
      });
    }
    firstYearSelection.on("change", handleYearSelectionChange);
    secondYearSelection.on("change", handleYearSelectionChange);

    // Setting default values and triggering the change event
    const firstYear = Years.sort()[0];
    const lastYear = Years.sort()[Years.length - 1];
    firstYearSelection.property("value", firstYear);
    secondYearSelection.property("value", lastYear);
    firstYearSelection.on("change")();
    secondYearSelection.on("change")();
  })
  .catch((error) => console.log("error:", error));
