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
        if (keys.length === 0) return;
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
                return xScale(sequence.data.time.toString());
            })
            .attr("width", xScale.bandwidth())
            .attr("y", sequence => {
                return yScale(sequence[1]);
            })
            .attr("height", sequence => {
                return yScale(sequence[0]) - yScale(sequence[1]);
            })
            .on("mouseover", function () { tooltip.style("display", null); })
            .on("mouseout", function () { tooltip.style("display", "none"); })
            .on("mousemove", function (d) {
                var xPosition = mouse(this)[0] + 10;
                var yPosition = mouse(this)[1] - 10;
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
        const xAxis = axisBottom(xScale);
        svg.select(".x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        const yAxis = axisLeft(yScale);
        let yAxisElm = svg.select(".y-axis");
        yAxisElm.call(yAxis);
        let cr =( yAxisElm.node() as HTMLElement).getBoundingClientRect();
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -cr.width*1.3) 
            .attr("x", 0)
            .text("Number of downloads")
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
                    <div className="container" key={ key }>
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