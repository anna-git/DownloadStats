using DownloadStats.Database;
using DownloadStats.Domain;
using DownloadStats.Domain.Stats;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public class DownloadRepository : IDownloadRepository
    {
        private readonly Context context;
        private readonly string baseUrl;
        private readonly string userName;

        public DownloadRepository(Context context, IConfiguration configuration)
        {
            this.context = context;
            IConfigurationSection configurationSection = configuration.GetSection("ReverseGeoCoding");
            this.baseUrl = configurationSection.GetSection("BaseUrl").Value;
            this.userName = configurationSection.GetSection("UserName").Value;
        }
        private readonly string[] AppIds = new string[]{"Empatica care", "Alert for embrace", "E4 realtime", "Mate for Embrace", "Empatica2", "Empatica3", "Empatica4"};
        public async Task<Domain.Maybe<Download>> Add(string appId, double latitude, double longitude, DateTime downloadedAt)
        {
            if (!AppIds.Contains(appId))
                return new Maybe<Download>($"app id must be one of these values: {string.Join(", ", AppIds)}");
            var countrycode = await GetCountryCode(latitude, longitude);
            if (string.IsNullOrEmpty(countrycode))
                return new Maybe<Download>($"no country code found for lat {latitude} and lng {longitude}");
            var dl = await context.Downloads.AddAsync(new Download(appId, latitude, longitude, downloadedAt, countrycode));
            await context.SaveChangesAsync();
            return new Maybe<Download>(dl.Entity);
        }
        public async Task<string?> GetCountryCode(double latitude, double longitude)
        {
            var url = $"{baseUrl}?lat={latitude}&lng={longitude}&username={userName}";
            using var httpClient = new HttpClient();
            var countrycode = await httpClient.GetStringAsync(url);
            countrycode = countrycode.Trim();
            if (countrycode.Contains("ERR") || countrycode.Length != 2)
                return null;
            return countrycode;
        }

        public async Task<IEnumerable<Download>> GetAll() => await context.Downloads.ToListAsync();

        public async Task<IEnumerable<Stat>> Get(string countryCode)
        {
            var stats = await this.context.Downloads.Where(d => d.CountryCode == countryCode)
                .Select(a => new
                {
                    appId = a.AppId,
                    dates = a.DownloadedAt
                }).ToListAsync();
            var statsC = stats.GroupBy(e=>e.appId).Select(e=> new Stat(e.Key, e.Select(d=>d.dates)));
            return statsC;
        }

        public async Task<IEnumerable<Stat>> Get()
        {
            var stats = await this.context.Downloads
                   .Select(a => new
                   {
                       appId = a.AppId,
                       dates = a.DownloadedAt
                   }).ToListAsync();
            var statsC = stats.GroupBy(e => e.appId).Select(e => new Stat(e.Key, e.Select(d => d.dates)));
            return statsC;
        }
    }
}
