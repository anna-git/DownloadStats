import * as SignalR from '@microsoft/signalr';
import * as React from "react";
import StackedBarChart from "./StackedBarChart";
import { IConnected, Stat } from "../models/Stats";


export default class GlobalStats extends React.Component<{ connection: SignalR.HubConnection }, { keys, colors, data, total }> {
    data: { keys: string[]; colors: string[]; data: {}; total: number };
    readonly colorsAppId: any = {
        "Empatica care": "red", "Alert for embrace": "blue", "E4 realtime": "green", "Mate for Embrace": "yellow", "Empatica2": "orange", "Empatica3": "purple", "Empatica4": "pink"
    };
    constructor(props: Readonly<IConnected>) {
        super(props); 
        this.state = {
            keys: new Array<string>(), colors: this.colorsAppId, data: [], total: 0 
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
        datal[3] = { time: "night" };
        let total = 0;
        items.forEach(i => {
            if (!keys[i.appId]) {
                keys.push(i.appId);
            }
            datal[0][i.appId] = i.morning;
            datal[1][i.appId] = i.afternoon;
            datal[2][i.appId] = i.evening;
            datal[3][i.appId] = i.night;
            total += i.total;
        });
        this.setState({
            keys: keys, data: datal, total: total
        });
    }
    componentDidMount() {
        this.getData();
        this.props.connection.on("new-download", this.getData.bind(this));
    }

    render() {
        return (
            <div>
                <h3>Worldwide: {this.state.total} downloads</h3>
                <StackedBarChart keys={this.state.keys} colors={this.state.colors} data={this.state.data} ></StackedBarChart>
            </div>
        );
    }
}