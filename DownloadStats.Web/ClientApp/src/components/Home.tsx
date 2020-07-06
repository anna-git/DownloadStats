import * as React from 'react';
import GlobalStats from "./GlobalStats";
import DownloadsMap from "./DownloadsMap";
import * as SignalR from '@microsoft/signalr';


export class Home extends React.Component {
    connection: SignalR.HubConnection;
    static displayName = Home.name;
    callbacks: Array<() => Promise<void>>;
    register: (cb: () => Promise<void>) => void;

    constructor(props: Readonly<{}>) {
        super(props);
        this.connection = new SignalR.HubConnectionBuilder().withUrl("/downloads-notifier").build();
        this.callbacks = new Array<() => Promise<void>>();
        let that = this;
        this.register = (cb) => {
            if (that.callbacks.length < 1)
                that.callbacks.push(cb);
        }
    }
    async componentDidMount() {
        this.connection.start().catch(e => console.log(e));
    }


    render() {
        return (
            <div className="row">
                <div className="col-sm-9">
                    <DownloadsMap connection={this.connection}></DownloadsMap>
                </div>
                <div className="col-sm-3">
                    <GlobalStats connection={this.connection} ></GlobalStats>
                </div>
            </div>
        );
    }

}  