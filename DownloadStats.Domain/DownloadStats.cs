using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Domain
{
    public class Stats
    {
        public Stats(int total, string country, int morning, int afternoon, int evening)
        {
            this.Total = total;
            this.Country = country;
            this.Morning = morning;
            this.Afternoon = afternoon;
            this.Evening = evening;
        }

        public int Total { get; }
        public string Country { get; }
        public int Morning { get; }
        public int Afternoon { get; }
        public int Evening { get; }
    }
}
