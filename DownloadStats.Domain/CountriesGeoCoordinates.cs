using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Domain
{
    public class CountriesGeoCoordinates
    {
        public CountriesGeoCoordinates(string code, double latitude, double longitude, string name)
        {
            this.Code = code;
            this.Latitude = latitude;
            this.Longitude = longitude;
            this.Name = name;
        }

        public string Code { get; private set; }
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }
        public string Name { get; private set; }
    }
}
