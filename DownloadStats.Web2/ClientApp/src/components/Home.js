import Map from "./Map";
import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <Map> </Map>
            </div>
        );
    }
}  