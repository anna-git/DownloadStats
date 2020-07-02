/* eslint-disable import/first */
import * as React from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { GeoPath } from "d3";
import * as SignalR from '@microsoft/signalr';

export default class Map extends React.Component {
    private currentProjection: any = {};
    private mouseClicked: boolean = false;
    private width: number = 962;
    private rotated: number = 90;
    private height: number = 502;
    private initX: number = 0;
    private g: any;
    private zoom: any = 0;
    private scale: number = 1;

    private path: GeoPath;  
    private connection: any;
    constructor(props) {
        super(props);
        this.connection = new SignalR.HubConnectionBuilder().withUrl("/downloads-notifier").build();
    }
    async getData() {
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
    rotateMap(endX: number) {
        this.currentProjection.rotate([this.rotated + (endX - this.initX) * 360 / (this.scale * this.width), 0, 0])
        this.g.selectAll('path')       // re-project path data
            .attr('d', this.path);
    }

    async componentDidMount() {
        this.currentProjection = d3.geoMercator()
            .translate([this.width / 2, this.height / 1.4])    // translate to center of screen. You might have to fiddle with this
            //depending on the size of your screen
            .scale(150);
        this.path = d3.geoPath().projection(this.currentProjection);
        const container = d3.select("#map-container");
        const svg = container.append("svg");
        let that = this;
        let zoomed = function () {
            var transform = d3.event.transform;
            that.scale = transform.k;
            if (transform.k === 1) { //don't pan if out of scale
                d3.event.transform.x = 0;
                d3.event.transform.y = 0;
            }
            that.g.attr("transform", d3.event.transform);
            d3.selectAll(".boundary").style("stroke-width", 1 / that.scale);
        }
        this.zoom = d3.zoom().scaleExtent([1, 20]).on("zoom", zoomed);
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
        var world: any = await d3.json("countries.json");
        var topoJson = topojson.feature(world, world.objects.countries) as any;
        this.g.selectAll('path').data(topoJson.features).enter()
            .append('path')
            .attr("name", function (d: any) { return d.properties.name; })
            .attr('d', (this.path as any))
            .attr('class', 'country');
        await this.connection.start();
        if (this.connection.connectionId) {
            this.connection.on("new-download", message => {
               
            });
        }   

    }


    render() {
        return (
            <div id="map-container"></div>
        );
    }

}
