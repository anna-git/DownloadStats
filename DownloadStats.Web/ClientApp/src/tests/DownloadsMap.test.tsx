import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import DownloadsMap from "../components/DownloadsMap";
import * as SignalR from '@microsoft/signalr';

jest.mock('@microsoft/signalr');
import fetch, { enableFetchMocks } from 'jest-fetch-mock'

//todo compatibility with leaflet and react scripts forces us to stay in an older version of jest.
test.skip("shows map download at rendering", async () => {
    enableFetchMocks();
    let c = SignalR.HubConnection;
    const e = render(<DownloadsMap connection={c} />)
})

