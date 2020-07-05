using System.Collections.Generic;
using System.Drawing;

namespace DownloadStats.Domain.Stats
{
    public class Stat
    {
        public Stat(string appId, int morning, int afternoon, int evening)
        {
            this.AppId = appId;
            this.Morning = morning;
            this.Afternoon = afternoon;
            this.Evening = evening;
        }
        public string AppId { get;  }
        public int Morning { get;  }
        public int Afternoon { get;  }
        public int Evening { get; }
    }
    public class CountryStats
    {
        public CountryStats(IEnumerable<Stat> stats)
        {
            this.Stats = stats;
        }

        public IEnumerable<Stat> Stats { get; }
    }
}
