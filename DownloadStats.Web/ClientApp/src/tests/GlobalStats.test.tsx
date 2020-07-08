import React from "react";
import { render, waitFor, fireEvent, waitForElement } from "@testing-library/react";
import GlobalStats from "../components/GlobalStats";
import fetch, { enableFetchMocks } from 'jest-fetch-mock'
import * as SignalR from '@microsoft/signalr';
jest.mock('@microsoft/signalr');

test("shows total download at rendering", async () => {
    enableFetchMocks();
    let c = SignalR.HubConnection;
    console.debug(c.on);
    fetch.mockResponse(JSON.stringify(
        [
            { appId: "Empatica3", morning: 12, afternoon: 0, evening: 10, night: 2, total: 24 },
            { appId: "Empatica4", morning: 2, afternoon: 20, evening: 1, night: 13, total: 36 },
        ]
    ));

    const e = render(<GlobalStats connection={c} />)
    let title = e.queryByText("Worldwide: 0 downloads");

    expect(title).not.toBeNull();
    expect(title).toBeDefined();

    await waitFor(() => {
        e.getByText("Worldwide: 60 downloads");
        let elm = e.container.getElementsByTagName("svg");
        expect(elm).not.toBeNull();
    });
}) 


test("tooltipshowing", async () => {
    enableFetchMocks();
    let c = SignalR.HubConnection;
    fetch.mockResponse(JSON.stringify(
        [
            { appId: "Empatica3", morning: 12, afternoon: 0, evening: 10, night: 2, total: 24 },
            { appId: "Empatica4", morning: 2, afternoon: 20, evening: 1, night: 13, total: 36 },
        ]
    ));

    const e = render(<GlobalStats connection={c} />)
    var tooltip: Element;
    await waitFor(() => {
        var tooltips = e.container.getElementsByClassName("tooltip");
        expect(tooltips.length).toEqual(1);
        tooltip = tooltips[0];
        expect(tooltip.getAttribute("style")).toContain("display: none");
    });

    let rects = e.container.getElementsByTagName("rect");
    expect(rects.length).toBeGreaterThan(1);
    let rect = rects[0];
    fireEvent.mouseOver(rect);

    expect(tooltip.getAttribute("style")).not.toContain("display: none");

}) 
