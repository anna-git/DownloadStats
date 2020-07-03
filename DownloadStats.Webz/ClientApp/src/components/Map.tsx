import * as React from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { GeoPath } from "d3";


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
    rotateMap(endX:number) {
        this.currentProjection.rotate([this.rotated + (endX - this.initX) * 360 / (this.scale * this.width), 0, 0])
        this.g.selectAll('path')       // re-project path data
            .attr('d', this.path);
    }
    private eventHandlers = {
        parent:this,
        zoomed() {
            var t = d3.event.translate;
            this.parent.scale = d3.event.scale;
            var h = 0;

            t[0] = Math.min(
                (this.parent.width / this.parent.height) * (this.parent.scale - 1),
                Math.max(this.parent.width * (1 - this.parent.scale), t[0])
            ); 

            t[1] = Math.min(
                h * (this.parent.scale - 1) + h * this.parent.scale,
                Math.max(this.parent.height * (1 - this.parent.scale) - h * this.parent.scale, t[1])
            );
            try {
                this.parent.zoom.translate(t);
                if (this.parent.scale === 1 && this.parent.mouseClicked) { 
                    this.parent.rotateMap(d3.mouse(this.parent as any)[0])
                    return;
                }
            }
            catch (e) {
                alert(e);
            }

            this.parent.g.attr("transform", "translate(" + t + ")scale(" + this.parent.scale + ")");
            
            //adjust the stroke width based on zoom level
            d3.selectAll(".boundary")
                .style("stroke-width", 1 / this.parent.scale);
        }

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
        this.zoom = d3.zoom().scaleExtent([1, 20]).on("zoom", this.eventHandlers.zoomed);
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
        svg.selectAll('path').data(topoJson.features).enter()
            .append('path')
            .attr("name", function (d: any) { return d.properties.name; })
            .attr('d', (this.path as any))
            .attr('class', 'country');

        this.getData();
    }


    render() {
        return (
            <div id="map-container"></div>
        ); 
    }
}
