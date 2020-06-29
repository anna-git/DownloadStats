import * as React from "react";
import * as d3 from "d3";

export default class Map extends React.Component {
    
    async componentDidMount() {
        const width = 1000;
        const height = 700;

        const projection = d3.geoMercator()
            .translate([width / 2, height / 1.4])    // translate to center of screen. You might have to fiddle with this
            //depending on the size of your screen
            .scale(150);

        const path = d3.geoPath().projection(projection);

        const container = d3.select("#map-container");
        const svg = container.append("svg");

        svg.attr("width", width)
            .attr("height", height)
            .append('g');
        let worldMap:any = await d3.json("map.json");
        svg.selectAll('path')
            .data(worldMap["features"])
            .enter()
            .append('path')
            .attr('class', 'country');
    }
    render() {
        return (
           <div id="map-container"></div>
        );
    }
}
