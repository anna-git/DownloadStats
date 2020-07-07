"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var d3_1 = require("d3");
var useResizeObserver_1 = require("./useResizeObserver");
function StackedBarChart(_a) {
    var keys = _a.keys, colors = _a.colors, data = _a.data;
    var svgRef = React.useRef();
    var wrapperRef = React.useRef();
    var dimensions = useResizeObserver_1.default(wrapperRef);
    React.useEffect(function () {
        if (keys.length === 0)
            return;
        var svg = d3_1.select(svgRef.current);
        var _a = wrapperRef.current.getBoundingClientRect(), width = _a.width, height = _a.height;
        // stacks / layers
        var stackGenerator = d3_1.stack().keys(keys);
        var layers = stackGenerator(data);
        var extent = [
            0,
            d3_1.max(layers, function (layer) {
                return d3_1.max(layer, function (sequence) {
                    return sequence[1];
                });
            })
        ];
        // scales
        var xScale = d3_1.scaleBand()
            .domain(data.map(function (d) { return d.time; }))
            .range([0, width])
            .padding(0.25);
        var yScale = d3_1.scaleLinear()
            .domain(extent)
            .range([height, 0]);
        svg.selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("fill", function (layer) {
            return colors[layer.key];
        })
            .selectAll("rect")
            .data(function (layer) { return layer; })
            .join("rect")
            .attr("x", function (sequence) {
            return xScale(sequence.data.time.toString());
        })
            .attr("width", xScale.bandwidth())
            .attr("y", function (sequence) {
            return yScale(sequence[1]);
        })
            .attr("height", function (sequence) {
            return yScale(sequence[0]) - yScale(sequence[1]);
        })
            .on("mouseover", function () { tooltip.style("display", null); })
            .on("mouseout", function () { tooltip.style("display", "none"); })
            .on("mousemove", function (d) {
            var xPosition = d3_1.mouse(this)[0] + 10;
            var yPosition = d3_1.mouse(this)[1] - 10;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d[1] - d[0] + " downloads");
        });
        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");
        //could have a react component
        tooltip.append("rect");
        tooltip.append("text")
            .attr("x", 40)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");
        // axes
        var xAxis = d3_1.axisBottom(xScale);
        svg.select(".x-axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);
        var yAxis = d3_1.axisLeft(yScale);
        var yAxisElm = svg.select(".y-axis");
        yAxisElm.call(yAxis);
        var cr = yAxisElm.node().getBoundingClientRect();
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -cr.width * 1.3)
            .attr("x", 0)
            .text("Number of downloads");
    }, [data, keys, colors, dimensions]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "chart" },
            React.createElement("div", { ref: wrapperRef, style: { marginBottom: "2rem" } },
                React.createElement("svg", { ref: svgRef },
                    React.createElement("g", { className: "x-axis" }),
                    React.createElement("g", { className: "y-axis" })))),
        React.createElement("div", null, Object.keys(colors).map(function (key) { return (React.createElement("div", { className: "container", key: key },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-md-3", style: { backgroundColor: colors[key], height: 25 } }),
                React.createElement("div", { className: "col" },
                    React.createElement("label", null, key))))); }))));
}
exports.default = StackedBarChart;
//# sourceMappingURL=StackedBarChart.js.map