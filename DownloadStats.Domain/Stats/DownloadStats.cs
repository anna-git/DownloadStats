using System.Collections.Generic;
using System.Drawing;

namespace DownloadStats.Domain.Stats
{
    public class TotalStat
    {
        public TotalStat(int total, Point coordinate, string countryCode)
        {
            this.Total = total;
            this.Coordinate = coordinate;
            this.CountryCode = countryCode;
        }

        public int Total { get; }
        public Point Coordinate { get; }
        public string CountryCode { get; }
    }
}
