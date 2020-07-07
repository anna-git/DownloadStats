using System;
using System.Collections.Generic;
using System.Linq;

namespace DownloadStats.Domain.Stats
{
    public class Stat
    {
        public Stat(string appId, IEnumerable<DateTime> dates)
        {
            this.AppId = appId;
            this.Morning = dates.Count(d => d.Hour < 12);
            this.Afternoon = dates.Count(d => d.Hour >= 12 && d.Hour <= 18);
            this.Evening = dates.Count(d => d.Hour > 18 && d.Hour <= 22);
            this.Night = dates.Count(d => d.Hour > 22);
        }

        public Stat(string appId, int morning, int afternoon, int evening, int night)
        {
            this.AppId = appId;
            this.Morning = morning;
            this.Afternoon = afternoon;
            this.Evening = evening;
            this.Night = night;
        }
        public string AppId { get; }
        public int Morning { get; }
        public int Afternoon { get; }
        public int Evening { get; }
        public int Night { get; }

        public int Total => Morning + Afternoon + Evening + Night;
    }
}
