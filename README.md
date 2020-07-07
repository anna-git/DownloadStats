# How to run
There's a docker file for a linux platform at the very root of the project built this way:
docker build -t downloadstats .
The docker file is for a linux platform. 

Environment variables available:
* Feeder=10 ([see below feeding data](#feeding-data)) >> 10 is the number of seconds between automatic adds in the database

So you simply need to run 
docker run -d -p 8080:80 --name downloadstats downloadstats -e "Feeder=20"  

Otherwise for windows docker containers, you need a docker file for windows that would look like this:
```javascript
#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat
#windows file

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
FROM node:10-alpine as build-node
WORKDIR /ClientApp
COPY DownloadStats.Web/ClientApp/package.json .
COPY DownloadStats.Web/ClientApp/package-lock.json .
RUN npm install
COPY DownloadStats.Web/ClientApp/ . 
RUN npm run build 
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
ENV BuildingDocker true
WORKDIR /src
COPY ["DownloadStats.Web/DownloadStats.Web.csproj", "DownloadStats.Web/"]
COPY ["DownloadStats.Services/DownloadStats.Services.csproj", "DownloadStats.Services/"]
COPY ["DownloadStats.Database/DownloadStats.Database.csproj", "DownloadStats.Database/"]
COPY ["DownloadStats.Domain/DownloadStats.Domain.csproj", "DownloadStats.Domain/"]
RUN dotnet restore "DownloadStats.Web/DownloadStats.Web.csproj"
COPY . .
WORKDIR "/src/DownloadStats.Web"
RUN dotnet build "DownloadStats.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DownloadStats.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build-node /ClientApp/build ./ClientApp/build

ENTRYPOINT ["dotnet", "DownloadStats.Web.dll"]
```

If you want, I also have a ready for linux docker image here: https://drive.google.com/file/d/1IhH7sGEm3U1Z_AUeyB-4q2VVdaOPCzGv/view?usp=sharing

# Architecture

Several classic layers: 
* database livestats.db (data access based on sql lite for the sake of this sample, configurable in appsettings.json), use DB Browser for SQLite.exe to explore. Databse looks like that: 
```
CREATE TABLE "Downloads" (
	"DownloadedAt"	DATETIME NOT NULL,
	"AppId"	TEXT NOT NULL,
	"Latitude"	REAL NOT NULL,
	"Longitude"	REAL NOT NULL,
	"CountryCode"	varchar(2) NOT NULL,
	"Id"	INTEGER NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
```
the country code is automatically found by the REST api so when calling the post method Add no need to give it [see below](##-manually)
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

AppId must be one of these values:
"Empatica care" or "Alert for embrace" or "E4 realtime" or "Mate for Embrace" or "Empatica2" or "Empatica3" or "Empatica4"
### example with Postman:
> {
        "appId": "Empatica care",   
        "latitude": 40.730610,      
        "longitude":  -73.968565242,        
        "downloadedAt": "2020-06-29T11:57:33.211235"        
} 

Every time you add an item through this API, there's a call to the geogson apis to reverse geo code the country name. Limit is 2000/day

# Once on the page

Several features available
* see **each** download available as a **marker** on the map
* see **clusters** when you unzoom
* click the clusters so that they spread to spiders web of markers
* a layer of country so that you can click the country itself to ses stats by country by app
* on the right, a stacked bar chart refreshed live too, showing the stats for all countries alltogether
* an alert is showing on the bottom right corner every time there's a new download added to the database.

