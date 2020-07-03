export interface Stats {
    CountryCode: string;
    Total: number;
    Country: string;
    Morning: number;
    Evening: number;
    Afternoon: number;
}
export interface Infos {
    Stats: Stats;
}

export interface Download {
    appId: string;
    id: number;
    latitude: number;
    longitude: number;
    downloadAt: Date;
    countryCode:string
}