function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


// set the dimensions and margins of the graph
var margin = {
        top: 10,
        right: 30,
        bottom: 50,
        left: 60
    },
    width = 850 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
svg.append("g").attr("id", "under-layer");
var underlayer = d3.select("#under-layer")

// Read the data and compute summary statistics for each specie
//Read the data
d3.csv("temp_data.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
        .domain([-80, 0])
        .range([0, width]);
    svg.append("g").attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.2).ticks(10));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([900, 980])
        .range([height, 0]);
    svg.append("g").attr("class", "axis")
        .call(d3.axisLeft(y).tickSize(-width * 1.3).ticks(7));

    // create a tooltip
    var tooltip = d3.select("#plot")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    var mouseover = function(d, i) {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("r", 10)
            .style("fill-opacity", 1);
        tooltip
            .transition()
            .duration(300)
            .style("visibility", "visible")
            .style("opacity", 1);
        d3.selectAll(".guide").remove();
        underlayer.append("line").attr("class", "guide")
            .attr("x1", x(d.MAX8))
            .attr("x2", x(d.MAX8))
            .attr("y1", 0)
            .attr("y2", height)
            .style("stroke", "#2ed2ff")
            .style("stroke-opacity", 0)
            .transition(300)
            .style("stroke-opacity", 1)
        underlayer.append("line").attr("class", "guide")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(d.MSLP))
            .attr("y2", y(d.MSLP))
            .style("stroke", "#2ed2ff")
            .style("stroke-opacity", 0)
            .transition(300)
            .style("stroke-opacity", 1)
        d3.selectAll(".dimension").remove();
        svg.append("text").attr("class", "dimension")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("y", y(d.MSLP))
            .attr("x", margin.left - 75)
            .attr("fill-opacity", 0)
            .attr("fill", "#2ed2ff")
            .text(d.MSLP)
            .transition(300).attr("fill-opacity", 1)
        svg.append("text").attr("class", "dimension")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("y", height + 10)
            .attr("x", x(d.MAX8))
            .attr("fill-opacity", 0)
            .attr("fill", "#2ed2ff")
            .text(d.MAX8)
            .transition(300).attr("fill-opacity", 1)
        d3.selectAll(".tick line").transition(300).style("stroke-opacity", 0.1)
        d3.selectAll(".tick text").transition(300).style("fill-opacity", 0.4)
    }
    var mousemove = function(d, i) {
        tooltip
            .html(`<b>${d.Storm.toUpperCase()}</b> (${d.Lat}°N)<br>${d.VDM}<br>FL Wind: ${d.FL} kt<br>Eye: ${d.Eye} nmi`)
            .style("left", (d3.mouse(this)[0] + 200) + "px")
            .style("top", (d3.mouse(this)[1] - 0) + "px")
    }
    var mouseleave = function(d, i) {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("r", 5)
            .style("fill-opacity", 0.2);
        tooltip
            .transition()
            .duration(300)
            .style("opacity", 0)
            .style("visibility", "hidden")
        d3.selectAll(".guide").transition(300).style("stroke-opacity", 0);
        d3.selectAll(".dimension").transition(300).style("fill-opacity", 0)
        d3.selectAll(".tick line").transition(300).style("stroke-opacity", 0.4)
        d3.selectAll(".tick text").transition(300).style("fill-opacity", 1)
    }

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 25)
        .attr("x", -margin.top - height / 2)
        .attr("fill", "#2ed2ffa0")
        .style("font-size", "14px")
        .text("Reconnaissance-Measured Central Pressure [hPa; mbar]")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 30)
        .attr("fill", "#2ed2ffa0")
        .style("font-size", "14px")
        .text("GOES-16 Band 8 Maximum Central Brightness Temperature [°C]");

    // Add dots
    svg.append('g').attr("id", "dot-layer")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return x(d.MAX8);
        })
        .attr("cy", function(d) {
            return y(d.MSLP);
        })
        .attr("r", 5)
        .style("fill", "#2ed2ff")
        .style("fill-opacity", 0.2)
        .style("stroke", "#2ed2ff99")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    function updatePlot() {
        let data = d3.selectAll('circle').data()
        var DEFAULT_MIN = 0
        var DEFAULT_MAX = 40
        var min_lat = d3.select("#minLatField").node().value
        var max_lat = d3.select("#maxLatField").node().value
        if (isNumeric(max_lat) && isNumeric(min_lat)) {
            min_lat = parseFloat(min_lat)
            max_lat = parseFloat(max_lat)
            if (min_lat > max_lat) {
                var temp = min_lat;
                min_lat = max_lat;
                max_lat = temp;
            }
            if (min_lat < DEFAULT_MIN) {
                min_lat = DEFAULT_MIN
            }
            if (min_lat > DEFAULT_MAX) {
                min_lat = DEFAULT_MAX
            }
            if (max_lat < DEFAULT_MIN) {
                max_lat = DEFAULT_MIN
            }
            if (max_lat > DEFAULT_MAX) {
                max_lat = DEFAULT_MAX
            }

        } else if (!isNumeric(min_lat) || !isNumeric(max_lat)) {
            min_lat = DEFAULT_MIN
            max_lat = DEFAULT_MAX
        }

        var DEFAULT_MIN_EYE = 0
        var DEFAULT_MAX_EYE = 60
        var min_eye = d3.select("#minEyeField").node().value
        var max_eye = d3.select("#maxEyeField").node().value
        if (isNumeric(max_eye) && isNumeric(min_eye)) {
            min_eye = parseFloat(min_eye)
            max_eye = parseFloat(max_eye)
            if (min_eye > max_eye) {
                var temp = min_eye;
                min_eye = max_eye;
                max_eye = temp;
            }
            if (min_eye < DEFAULT_MIN_EYE) {
                min_eye = DEFAULT_MIN_EYE
            }
            if (min_eye > DEFAULT_MAX_EYE) {
                min_eye = DEFAULT_MAX_EYE
            }
            if (max_eye < DEFAULT_MIN_EYE) {
                max_eye = DEFAULT_MIN_EYE
            }
            if (max_eye > DEFAULT_MAX_EYE) {
                max_eye = DEFAULT_MAX_EYE
            }

        } else if (!isNumeric(min_eye) || !isNumeric(max_eye)) {
            min_eye = DEFAULT_MIN_EYE
            max_eye = DEFAULT_MAX_EYE
        }

        var valid_eyes = []
        if (d3.select("#eyeCircular").node().checked) {
            valid_eyes.push("Circular")
        }
        if (d3.select("#eyeConcentric").node().checked) {
            valid_eyes.push("Concentric")
        }
        if (d3.select("#eyeElliptical").node().checked) {
            valid_eyes.push("Elliptical")
        }


        console.log("LAT:" + min_lat + " " + max_lat)
        console.log("EYE:" + min_eye + " " + max_eye)
        console.log(valid_eyes)


        d3.selectAll('circle').each(function(d) {
            if ((d.Lat < min_lat || d.Lat > max_lat) || (d.Radius < min_eye || d.Radius > max_eye) || !valid_eyes.includes(d.EyeType)) {
                d3.select(this).transition(300).style("opacity", 0.05).style("pointer-events", "none")
            } else {
                d3.select(this).transition(300).style("opacity", 1).style("pointer-events", "all")
            }
        });
    }
    d3.select("#minLatField").on("input", updatePlot)
    d3.select("#maxLatField").on("input", updatePlot)
    d3.select("#minEyeField").on("input", updatePlot)
    d3.select("#maxEyeField").on("input", updatePlot)
    d3.select("#eyeCircular").on("input", updatePlot)
    d3.select("#eyeConcentric").on("input", updatePlot)
    d3.select("#eyeElliptical").on("input", updatePlot)
})