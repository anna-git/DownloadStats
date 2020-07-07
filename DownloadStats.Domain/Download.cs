using System;

namespace DownloadStats.Domain
{
    public class Download
    {
        public Download(string appId, double latitude, double longitude, DateTime downloadedAt, string countryCode)
        {
            this.AppId = appId;
            this.Latitude = latitude;
            this.Longitude = longitude;
            this.DownloadedAt = downloadedAt;
            this.CountryCode = countryCode;
        }

        public int Id { get; private set; }
        public string AppId { get; private set; }
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }
        public DateTime DownloadedAt { get; private set; }
        public string CountryCode { get; private set; }

        public string DownloadedAtNice => DownloadedAt.ToString("g"); // There is no standard JSON representation of dates so won't be deserialized as date, could have an exstension browser side
    }
}
