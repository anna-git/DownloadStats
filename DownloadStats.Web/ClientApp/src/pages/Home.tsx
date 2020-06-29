import * as React from "react";
import  Map from "../components/Map";

export class Home extends React.Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Hello, world!</h1>
            <p>Welcome to your new single-page application, built with:</p>
            <Map> </Map>
      </div>
    );
  }
}
