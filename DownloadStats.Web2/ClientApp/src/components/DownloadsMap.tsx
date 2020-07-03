/* eslint-disable import/first */
import * as React from "react";
import * as SignalR from '@microsoft/signalr';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet'
import PieChartTooltip from "./PieChartTooltip";
import * as ReactDOM from "react-dom";
import { Infos, Stats } from "../models/Stats";


export default class DownloadsMap extends React.Component {
    private currentProjection: any = {};
    private connection: any;
    private position: any = [51.505, -0.09];

    private downloadInfos: Array<Infos>;
    constructor(props: Readonly<{}>) {
        super(props);
        this.connection = new SignalR.HubConnectionBuilder().withUrl("/downloads-notifier").build();
        this.downloadInfos = new Array<Infos>();
    }
    async getData() {
        var res = await fetch("/Downloads");
        var stats = await res.json() as Array<Stats>;
        stats.forEach(s => {

        })
    }

    async refreshData(countryCode: string) {
        //var res = await fetch(`/Downloads${countryCode}`);
        //var s = await res.json() as Stats;
        //var elm = this.downloadInfos.find(e => e.Stats.CountryCode == s.CountryCode);
        //if (elm == null) {
        //    let e = <PieChartTooltip Stats={s}></PieChartTooltip>;
        //    ReactDOM.createPortal(e, document.getElementById("#" + s.CountryCode) as HTMLElement);
        //}

    }
   

    async componentDidMount() {
        

        await this.connection.start();
        if (this.connection.connectionId) {
            this.connection.on("new-download", (countryCode: string) => {
                this.refreshData(countryCode);
            });
        }

        this.getData();

    }


    render() {
        return (
            <Map zoom={13}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={this.position}>
                    <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                </Marker>
            </Map>
        );
    }

}
