import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Layer } from 'leaflet'
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import { Stat, Download, IConnected } from "../models/Stats";
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import countries from './Countries'; 
 

export default class DownloadsMap extends React.Component<IConnected, {}> { 

    private position: any = [51.505, -0.09];
    countries: any;
    private connection: any;

    constructor(props: Readonly<IConnected>) {
        super(props);
        this.state = {
            downloads: new Array<Download>()
        }
        this.connection = props.connection;
        //fix react leaflet interaction.. explore on how to improve
        let DefaultIcon = L.icon({
            iconUrl: 'leaflet/dist/images/marker-icon.png',
            shadowUrl: 'leaflet/dist/images/marker-shadow.png'
        });

        L.Marker.prototype.options.icon = DefaultIcon;
        //todo custom icon per app id, easy with binding
    }

    async getData() {
        var res = await fetch("/Downloads");
        let items = await res.json() as Array<Download>;

        this.setState({
            downloads: items
        });
    }

    async componentDidMount() {
        await this.getData();
        this.connection.on("new-download", this.getData.bind(this));
    }

    onEachFeature(feature: GeoJSON.Feature<GeoJSON.GeometryObject, any>, layer: Layer): any {
        layer.bindTooltip("Click a country to see    stats");
        layer.on('mouseover', function () {
            (layer as any).setStyle({
                'fillColor': 'green',
                'fillOpacity': '0.3'
            });
        });
        layer.on('mouseout', function () {
            (layer as any).setStyle({
                'fillColor': 'transparent',
                'fillOpacity': '0.1'
            });
        });
        layer.on({
            click: async function (event) {
                var res = await fetch(`/Downloads/Stats/${feature.properties.countryCode}`);
                let items = await res.json() as Array<Stat>;
                const listItems = items.map(d => {
                    var periods = [d.morning, d.afternoon, d.evening, d.night];
                    periods = periods.sort((one, two)=> one > two ? -1 : 1);
                    return (<tr>
                        <td>{d.appId}</td>
                        <td className={periods[0] === d.morning ? "greatest":""}>{d.morning}</td>
                        <td className={periods[0] === d.afternoon ? "greatest" : ""}>{d.afternoon}</td>
                        <td className={periods[0] === d.evening ? "greatest" : ""}>{d.evening}</td>
                        <td className={periods[0] === d.night ? "greatest" : ""}>{d.night}</td>
                        <td className="total">{d.total}</td>
                    </tr>);
                });

                var content = ReactDOMServer.renderToString(<div className="country-stats-container">
                    <h5>{feature.properties.name}</h5>
                    {listItems.length ?
                        <table className="stats">
                            <tr>
                                <th>App name</th>
                                <th>Morning</th>
                                <th>Afternoon</th>
                                <th>Evening</th>
                                <th>Night</th>
                                <th>TOTAL</th>
                            </tr>
                            {listItems}
                        </table>
                        : <label>No users yet</label>
                    }
                </div>
                );
                L.popup({ maxWidth: 450}).setLatLng(event.latlng).setContent(content).openOn((layer as any)._map);

            }
        });

    }

    render() {
        const listItems = ((this.state as any).downloads as Array<Download>).map(d =>
            <Marker position={[d.latitude, d.longitude]} key={d.id}>
                <Popup key={d.id}>
                    <h3><span className="badge badge-primary">{d.appId}</span></h3>
                    <div>Downloaded at: {d.downloadedAtNice}</div>
                </Popup>
            </Marker>);

        return (
            <div>
                <Map center={this.position} zoom={5} bounceAtZoomLimits={true}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <GeoJSON data={countries as GeoJSON.GeoJsonObject} onEachFeature={this.onEachFeature}
                        fillColor='transparent'
                        fillOpacity={0.1}
                        weight={0.3}>
                    </GeoJSON>

                    <MarkerClusterGroup>
                        {listItems}
                    </MarkerClusterGroup>
                </Map>
            </div >
        )
    }

}

