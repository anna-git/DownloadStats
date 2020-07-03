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

        public async Task<Download> Add(string appId, double latitude, double longitude, DateTime downloadedAt)
        {
            var countrycode = await GetCountryCode(latitude, longitude);
            var dl = await context.Downloads.AddAsync(new Download(appId, latitude, longitude, downloadedAt, countrycode));
            await context.SaveChangesAsync();
            return dl.Entity;
        }
        public async Task<string> GetCountryCode(double latitude, double longitude)
        {
            var url = $"{baseUrl}?lat={latitude}&lng={longitude}&username={userName}";
            using var httpClient = new HttpClient();
            var countrycode = await httpClient.GetStringAsync(url);
            countrycode = countrycode.Trim();
            return countrycode;
        }
       
        public async Task<IEnumerable<TotalStat>> GetAllByCountry()
        {
            //return await context.Downloads.GroupBy(d => d.CountryCode).Select(e => new TotalStat(e.Count(), context. e.Key)).ToListAsync();
            throw new NotImplementedException();

        }

        public async Task<IEnumerable<Download>> GetAll()
        {
            return await context.Downloads.ToListAsync();
        }
    }
}
