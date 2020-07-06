﻿import * as React from "react";
import StackedBarChart from "./StackedBarChart";
import { IConnected, Stat } from "../models/Stats";


export default class DownloadsMap extends React.Component<{}> {
    connection: any;
    data: { keys: string[]; colors: string[]; data: any; };
    readonly colorsAppId: any = {
        "Empatica care": "red",
        "Alert for embrace": "blue", "E4 realtime": "green", "Mate for Embrace": "yellow", "Empatica2": "orange", "Empatica3": "purple", "Empatica4": "pink"
    };
    constructor(props: Readonly<IConnected>) {
        super(props);
        this.connection = props.connection;
        this.state = {
            keys: new Array<string>(), colors: this.colorsAppId, data: []
        }
    }
    async getData() {
        var res = await fetch("/Downloads/Stats");
        let items = await res.json() as Array<Stat>;
        let datal = [];
        let keys = new Array<string>();
        datal[0] = { time: "morning" };
        datal[1] = { time: "afternoon" };
        datal[2] = { time: "evening" };

        items.forEach(i => {
            if (!keys[i.appId]) {
                keys.push(i.appId);
            }
            datal[0][i.appId] = i.morning;
            datal[1][i.appId] = i.afternoon;
            datal[2][i.appId] = i.evening;
        });

        this.setState({
            keys: keys, data: datal
        });
    }
    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div>
                <StackedBarChart keys={this.state.keys} colors={this.state.colors} data={this.state.data} ></StackedBarChart>
            </div>
        );
    }
}