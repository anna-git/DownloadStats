import * as React from "react";
import {
    select,
    scaleBand,
    axisBottom,
    stack,
    max,
    mouse,
    scaleLinear,
    axisLeft
} from "d3";
import useResizeObserver from "./useResizeObserver";

function StackedBarChart({ keys, colors, data }) {

    const svgRef = React.useRef();

    const wrapperRef = React.useRef();
    const dimensions = useResizeObserver(wrapperRef);

    React.useEffect(() => {
        if (keys.length == 0) return;
        const svg = select(svgRef.current);
        const { width, height } =
            //dimensions ||
            wrapperRef.current.getBoundingClientRect();

        // stacks / layers
        const stackGenerator = stack().keys(keys);
        const layers = stackGenerator(data);
        const extent = [
            0,
            max(layers, layer => {
                return max(layer, sequence => {
                    return sequence[1];
                });
            })
        ];

        // scales
        const xScale = scaleBand()
            .domain(data.map(d => d.time))
            .range([0, width])
            .padding(0.25);

        const yScale = scaleLinear()
            .domain(extent)
            .range([height, 0]);

        //var tooltip = select(".chart")
        //    //.append("div")
        //    .style("opacity", 0)
        //    .attr("class", "tooltip")
        //    .style("background-color", "white")
        //    .style("border", "solid")
        //    .style("border-width", "1px")
        //    .style("border-radius", "5px")
        //    .style("padding", "10px")

        //// Three function that change the tooltip when user hover / move / leave a cell
        //var mouseover = function (d) {
        //    tooltip
        //        .html(`<label>${d.key}</label>`)
        //        .style("opacity", 1)
        //}
        //var mousemove = function (d) {
        //    tooltip
        //        .style("left", (mouse(this)[0]) + "px")
        //        .style("top", (mouse(this)[1]) + "px")
        //}
        //var mouseleave = function (d) {
        //    tooltip.style("opacity", 1)
        //}
        // rendering
        svg.selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("fill", layer => {
                return colors[layer.key];
            })
            .selectAll("rect")
            .data(layer => layer)
            .join("rect")

            .attr("x", sequence => {
                return xScale(sequence.data.time);
            })
            .attr("width", xScale.bandwidth())
            .attr("y", sequence => {
                return yScale(sequence[1]);
            })
            .attr("height", sequence => {
                return yScale(sequence[0]) - yScale(sequence[1]);
            });

        // axes
        const xAxis = axisBottom(xScale);
        svg.select(".x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        const yAxis = axisLeft(yScale);
        svg.select(".y-axis").call(yAxis);
    }, [data, keys, colors, dimensions]);


    return (
        <React.Fragment>
            <div className="chart">
                <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
                    <svg ref={svgRef}>
                        <g className="x-axis" />
                        <g className="y-axis" />
                    </svg>
                </div>
            </div>
            <div>
                {Object.keys(colors).map(key => (
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3" style={{ backgroundColor: colors[key], height: 25 }}>
                            </div>
                            <div className="col">
                                <label>{key}</label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment >
    );
}
export default StackedBarChart;