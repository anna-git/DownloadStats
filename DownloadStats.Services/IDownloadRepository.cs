using DownloadStats.Domain;
using DownloadStats.Domain.Stats;
using GeekLearning.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public interface IDownloadRepository
    {
        Task<Maybe<Download>> Add(string appId, double latitude, double longitude, DateTime downloadedAt);
        Task<IEnumerable<Download>> GetAll();
        Task<IEnumerable<Domain.Stats.Stat>> Get(string countryCode);
        Task<IEnumerable<Domain.Stats.Stat>> Get();
    }
}
