// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 850 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
svg.append("g").attr("id","under-layer");
var underlayer = d3.select("#under-layer")

// Read the data and compute summary statistics for each specie
//Read the data
d3.csv("temp_data.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-80, 0])
    .range([ 0, width ]);
  svg.append("g").attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height*1.2).ticks(10));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([900, 980])
    .range([ height, 0]);
  svg.append("g").attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7));

  // create a tooltip
  var tooltip = d3.select("#plot")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
  var mouseover = function(d, i) {
  	d3.select(this)
  		.transition()
  		.duration(300)
  		.attr("r",10)
  		.style("fill-opacity",1);
    tooltip
      .transition()
      .duration(300)
      .style("opacity", 1);
    d3.selectAll(".guide").remove();
    underlayer.append("line").attr("class","guide")
    	.attr("x1", x(d.MAX8))
    	.attr("x2", x(d.MAX8))
    	.attr("y1", 0)
    	.attr("y2", height)
    	.style("stroke","#2ed2ff")
    	.style("stroke-opacity", 0)
    	.transition(300)
    	.style("stroke-opacity",1)
    	.transition(300)
    	.style("stroke-width",3);
    underlayer.append("line").attr("class","guide")
    	.attr("x1", 0)
    	.attr("x2", width)
    	.attr("y1", y(d.MSLP))
    	.attr("y2", y(d.MSLP))
    	.style("stroke","#2ed2ff")
    	.style("stroke-opacity", 0)
    	.transition(300)
    	.style("stroke-opacity",1)
    	.transition(300)
    	.style("stroke-width",3);
    d3.selectAll(".dimension").remove();
    svg.append("text").attr("class","dimension")
    	.attr("text-anchor","middle")
    	.attr("dominant-baseline","middle")
    	.attr("y",y(d.MSLP))
    	.attr("x",margin.left-75)
    	.attr("fill-opacity",0)
    	.attr("fill","#2ed2ff")
    	.text(d.MSLP)
    	.transition(300).attr("fill-opacity",1)
    svg.append("text").attr("class","dimension")
    	.attr("text-anchor","middle")
    	.attr("dominant-baseline","middle")
    	.attr("y",height+10)
    	.attr("x",x(d.MAX8))
    	.attr("fill-opacity",0)
    	.attr("fill","#2ed2ff")
    	.text(d.MAX8)
    	.transition(300).attr("fill-opacity",1)
    d3.selectAll(".tick line").transition(300).style("stroke-opacity",0.1)
    d3.selectAll(".tick text").transition(300).style("fill-opacity",0.4)
  }
  var mousemove = function(d, i) {
    tooltip
      .html(`<b>${d.Name.toUpperCase()}</b> (${d.Lat}°N)<br>${d.Time}<br>FL Wind: ${d.FL} kt<br>Eye: ${d.Eye} nmi`)
      .style("left", (d3.mouse(this)[0]+200) + "px")
      .style("top", (d3.mouse(this)[1]-0) + "px")
  }
  var mouseleave = function(d, i) {
  	d3.select(this)
  		.transition()
  		.duration(300)
  		.attr("r",3)
  		.style("fill-opacity",0.2);
    tooltip
      .transition()
      .duration(300)
      .style("opacity", 0)
    d3.selectAll(".guide").transition(300).style("stroke-opacity", 0);
    d3.selectAll(".dimension").transition(300).style("fill-opacity",0)
    d3.selectAll(".tick line").transition(300).style("stroke-opacity",0.4)
    d3.selectAll(".tick text").transition(300).style("fill-opacity",1)
  }

  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 25)
      .attr("x", -margin.top - height/2)
      .attr("fill", "#2ed2ffa0")
      .text("Reconnaissance-Measured Central Pressure [hPa; mbar]")

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width/2 + margin.left)
      .attr("y", height + margin.top + 30)
      .attr("fill", "#2ed2ffa0")
      .text("GOES-16 Band 8 Maximum Central Brightness Temperature [°C]");

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.MAX8); } )
      .attr("cy", function (d) { return y(d.MSLP); } )
      .attr("r", 3)
      .style("fill", "#2ed2ff")
      .style("fill-opacity",0.2)
      .style("stroke", "#2ed2ff99")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )

})