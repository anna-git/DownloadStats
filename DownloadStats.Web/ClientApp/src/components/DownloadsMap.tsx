/* eslint-disable import/first */
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import * as SignalR from '@microsoft/signalr';
import { Layer } from 'leaflet'
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
//import PieChartTooltip from "./PieChartTooltip";
import { Infos, Stats, Download } from "../models/Stats";
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import svg from "../assets/suitcaseIcon.svg"
import svgShadow from "../assets/marker-shadow.png"
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import countries from './Countries';
import ReactDOM from "react-dom";

export const suitcasePoint = new L.Icon({
    iconUrl: svg,
    iconRetinaUrl: svg,
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [40, 40],
    shadowUrl: svgShadow,
    shadowSize: [29, 40],
    shadowAnchor: [7, 40],
})
export default class DownloadsMap extends React.Component {

    private currentProjection: any = {};
    private connection: any;
    private position: any = [51.505, -0.09];
    countries: any;

    constructor(props: Readonly<{}>) {
        super(props);
        this.connection = new SignalR.HubConnectionBuilder().withUrl("/downloads-notifier").build();
        this.state = {
            downloads: new Array<Download>()
        }
    }

    async getData() {
        var res = await fetch("/Downloads");
        let items = await res.json() as Array<Download>;

        this.setState({
            downloads: items
        });
    }

    async componentDidMount() {

        await this.connection.start();
        if (this.connection.connectionId) {
            this.connection.on("new-download", (countryCode: string) => {
                this.getData();
            });
        }
        this.getData();
    }

    onEachFeature(feature: GeoJSON.Feature<GeoJSON.GeometryObject, any>, layer: Layer): any {
        layer.on({
            click: async function (event) {
                var res = await fetch(`/Downloads/${feature.properties.countryCode}`);
                

                var popup = L.popup()
                    .setLatLng(event.latlng)
                    .setContent(`<div>${feature.properties.name}</div>`).openOn((layer as any)._map);

            }
        });

    }

    render() {
        const listItems = ((this.state as any).downloads as Array<Download>).map(d =>
            <Marker position={[d.latitude, d.longitude]} key={d.id} icon={suitcasePoint}>
                <Popup>
                    <div></div>
                </Popup>
            </Marker>);

        return (
            <div>
                <Map center={this.position} zoom={5} bounceAtZoomLimits={true}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <GeoJSON data={countries} onEachFeature={this.onEachFeature}
                        color='red'
                        fillColor='green'
                        fillOpacity={0.5}
                        weight={1}>
                        </GeoJSON>

                            <MarkerClusterGroup>

                                {listItems}
                            </MarkerClusterGroup>
                </Map>
            </div>
        )
    }
    test(): any {

        var l = this;
    }




}

