/* eslint-disable import/first */
import * as React from "react";
import * as SignalR from '@microsoft/signalr';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
//import PieChartTooltip from "./PieChartTooltip";
import { Infos, Stats, Download } from "../models/Stats";
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import svg from "../assets/suitcaseIcon.svg"
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

export const suitcasePoint = new L.Icon({
    iconUrl: svg,
    iconRetinaUrl: svg,
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [40, 40],
    shadowUrl: '../assets/marker-shadow.png',
    shadowSize: [29, 40],
    shadowAnchor: [7, 40],
})
export default class DownloadsMap extends React.Component {

    private currentProjection: any = {};
    private connection: any;
    private position: any = [51.505, -0.09];

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

    render() {
        const listItems = ((this.state as any).downloads as Array<Download>).map(d =>
            <Marker position={[d.latitude, d.longitude]} key={d.id} icon={suitcasePoint}>
                <Popup>whatever.</Popup>
            </Marker>);

        return (
            <div>
                <Map center={this.position} zoom={5} bounceAtZoomLimits={true}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <MarkerClusterGroup>
                        {listItems}
                    </MarkerClusterGroup>
                </Map>
            </div>
        )
    }

}

