// !selection year (we can choose only bothb of these years)
const secondSection = d3.select(".second-section");
const containerYear = d3.select(".container-year");
const selectBtnYear = d3.select(".select-btn-year");
const listItemsYear = d3.select(".list-items-year");
const itemsYear = d3.selectAll(".item-year");

//! fethcing data
d3.csv("./data.csv")
  .then(function (data) {
    data.forEach(function (d) {
      d.Year = String(d.Year);
      d.Rank = +d.Rank;
    });

    //! multiple selected years tracking
    let selectedYears = [];

    //! selections' datas
    const Countries = [...new Set(data.map((d) => d.Country))];
    const Amounts = [...new Set(data.map((d) => d.Amount))];
    const Years = [...new Set(data.map((d) => d.Year))];

    //! selections' options
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

    // !selection of year  - onClick
    listItemYear.on("click", function () {
      const item = d3.select(this);
      const year = parseInt(item.text());
      const isChecked = item.classed("checked");
      const checkedItems = listItemYear.filter(".checked");

      if (isChecked && checkedItems.size() <= 2) {
        item.classed("checked", false);
        selectedYears = selectedYears.filter((c) => c !== year);
      } else if (!isChecked && checkedItems.size() < 2) {
        item.classed("checked", true);
        selectedYears.push(year);
      }
      console.log(selectedYears);
    });
  })
  .catch((error) => console.log("error:", error));
