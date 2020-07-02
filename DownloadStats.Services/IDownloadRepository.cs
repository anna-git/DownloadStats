using DownloadStats.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public interface IDownloadRepository
    {

        Task<Download> Add(string appId, double latitude, double longitude, DateTime downloadedAt);
        Task<IEnumerable<Stats>> GetMain(int number);
    }
}
