import * as SignalR from '@microsoft/signalr';

export interface Stat {
    appId: string;
    total: number;
    morning: number;
    evening: number;
    afternoon: number;
}

export interface Download {
    appId: string;
    id: number;
    latitude: number;
    longitude: number;
    downloadedAtNice: Date;
    countryCode:string
}

export interface IConnected {
    connection: SignalR.HubConnection;
}