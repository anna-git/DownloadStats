#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat
#windows file

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
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
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
ENV BuildingDocker true
ENV Feeder=10
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