# Architecture

Several classic layers: 
* database livestats.db (data access based on sql lite for the sake of this sample, configurable in appsettings.json), use DB Browser for SQLite.exe to explore.
* domain, business objects
* services (fetching data)
* web (front-end part): typescript, react, leaflet for the map alltogether. IOC for services. Signal R to notify a new add in database
I didn't have time to write tests to be honest.

# Feeding data

## Automatically 
In the web project there's a Feeder class, it's a hosted service programed to inject fake data in the sql lite database periodically.
Its frequency is **configurable** in appsettings.json, in seconds. If 0, then it's stopped. 
It allows you to see live data on the webpage, plugged with Signal R to read fresh data live as soon as it arrives

## Manually
There's an api : /Add expecting a post request width the folowwing property:
   * AppId
   * Latitude
   * Longitude
   * DownloadedAt
### example with Postman:
> { 
        "appId": "s",
        "latitude": 40.730610,
        "longitude":  -73.968565242,
        "downloadedAt": "2020-06-29T11:57:33.211235"
}
Every time you add an item through this API, there's a call to the geogson apis to reverse geo code the country name. Limit is 2000/day

#Once on the page

Several features available
* see **each** download available as a **marker** on the map
* see **clusters** when you unzoom
* click the clusters so that they spread to spiders web of markers
* a layer of country so that you can click the country itself to ses stats by country by app
* on the right, a stacked bar chart refreshed live too, showing the stats for all countries alltogether
* an alert is showing on the bottom right corner every time there's a new download added to the database.

