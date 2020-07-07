import * as React from 'react';
import GlobalStats from "./GlobalStats";
import DownloadsMap from "./DownloadsMap";
import * as SignalR from '@microsoft/signalr';


export class Home extends React.Component<{}, { showNewDl: boolean }>  {
    connection: SignalR.HubConnection;
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.connection = new SignalR.HubConnectionBuilder().withUrl("/downloads-notifier").build();
        this.state = {
            showNewDl: false
        }
    }
    async componentDidMount() {
        await this.connection.start();
        this.connection.on("new-download", () => {
            this.setState({
                showNewDl: true
            })
            setTimeout(() => this.setState({
                showNewDl: false
            }), 5000
            );
        });
    }


    render() {
        var className = "alert alert-primary " + (this.state.showNewDl ? "new-download-alert" : "");

        return (
            <div className="row">
                <div className="col-sm-9">
                    <DownloadsMap connection={this.connection}></DownloadsMap>
                </div>
                <div className="col-sm-3">
                    <GlobalStats connection={this.connection} ></GlobalStats>
                    <div id="new-download-alert" className={className} role="alert" >
                        New download just happened, displayed data is up to date!
                    </div>
                </div>
            </div>
        );
    }

}  