using DownloadStats.Domain;
using DownloadStats.Domain.Stats;
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
        Task<IEnumerable<Download>> GetAll();
        Task<Domain.Stats.CountryStats> Get(string countryCode);
    }
}
