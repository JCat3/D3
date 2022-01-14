// @TODO: YOUR CODE HERE!
// Followed Week 3 activity 9 example of D3 to solve homework

// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

  // height of the browser window.
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //import data
  d3.csv("assets/data/data.csv").then((stateData) => {
    
      // Step 1: Parse Data/Cast as numbers
      stateData.forEach(function(data){
        data.income = +data.income;
        data.obesity = +data.obesity;
      });

    // Step 2: Create scale functions
      var xLinearScale = d3.scaleLinear()
        .domain([5, d3.max(stateData, d=> d.income)])
        .range([0, width]);
      
    
      var yLinearScale = d3.scaleLinear()
        .domain([5, d3.max(stateData, d=> d.obesity)])
        .range([height, 0]);

    // Step 3: Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

        // Step 5: Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "purple")
        .attr("opacity", ".25");

      // Step 6: Initialize tool tip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`);
        });

      // Step 7: Create tooltip in the chart
      chartGroup.call(toolTip);

      // Step 8: Create event listeners to display and hide the tooltip
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
      // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity Rate (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Income Level ($)");

  }).catch(function(error) {
    console.log(error);
  });

  console.log("hello");

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
