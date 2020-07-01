import React, { Component } from 'react';
import * as d3 from d3;
import * as topojson from "topojson-client";
import { GeoPath } from "d3";


export default class Map extends Component {
    currentProjection;
    mouseClicked = false;
    width = 962;
    rotated = 90;
    height = 502;
    initX = 0;
    g;
    zoom = 0;
    scale = 1;
    path;
    getData() {
        fetch("/Downloads")
            .then(res => res.json())
            .then(
                (result) => {
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow 
                // exceptions from actual bugs in components.
                (error) => {

                }
            )
    }
    rotateMap(endX) {
        this.currentProjection.rotate([this.rotated + (endX - this.initX) * 360 / (this.scale * this.width), 0, 0])
        this.g.selectAll('path')       // re-project path data
            .attr('d', this.path);
    }
    eventHandlers = {
        zoomed() {
            var t = d3.event.translate;
            this.scale = d3.event.scale;
            var h = 0;
            
            t[0] = Math.min((this.width / this.height) * (this.scale - 1),Math.max(this.width * (1 - this.scale), t[0]));

            t[1] = Math.min(
                h * (this.scale - 1) + h * this.scale,
                Math.max(this.height * (1 - this.scale) - h * this.scale, t[1])
            );
            try {
                this.zoom.translate(t);
                if (this.scale === 1 && this.mouseClicked) {
                    this.rotateMap(d3.mouse(this)[0])
                    return;
                }
            }
            catch (e) {
                alert(e);
            }

            this.g.attr("transform", "translate(" + t + ")scale(" + this.scale + ")");

            //adjust the stroke width based on zoom level
            d3.selectAll(".boundary")
                .style("stroke-width", 1 / this.scale);
        }

    }
    componentDidMount() {
        debugger;
        this.currentProjection = d3.geoMercator()
            .translate([this.width / 2, this.height / 1.4])    // translate to center of screen. You might have to fiddle with this
            //depending on the size of your screen
            .scale(150);
        this.path = d3.geoPath().projection(this.currentProjection);
        const container = d3.select("#map-container");
        const svg = container.append("svg");
        let that = this;
        this.zoom = d3.zoom().scaleExtent([1, 20]).on("zoom", this.eventHandlers.zoomed.bind(this));
        this.g = svg.attr("width", this.width).attr("height", this.height)
            .on("mousedown", function () {
                d3.event.preventDefault();
                //only if scale === 1
                if (that.scale !== 1) return;
                that.initX = d3.mouse(this)[0];
                that.mouseClicked = true;
            })
            .on("mouseup", function () {
                if (that.scale !== 1) return;
                that.rotated = that.rotated + ((d3.mouse(this)[0] - that.initX) * 360 / (that.scale * that.width));
                that.mouseClicked = false;
            })
            .call(this.zoom).append('g');
        var world = d3.json("countries.json", function () {
            var topoJson = topojson.feature(world, world.objects.countries);
            svg.selectAll('path').data(topoJson.features).enter()
                .append('path')
                .attr("name", function (d) { return d.properties.name; })
                .attr('d', (this.path))
                .attr('class', 'country');

        });
        this.getData();
    }


    render() {
        return (
            <div id="map-container"></div>
        );
    }
}