﻿using DownloadStats.Database;
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

        public async Task<IEnumerable<Download>> GetAll()
        {
            return await context.Downloads.ToListAsync();
        }

        public async Task<CountryStats> Get(string countryCode)
        {
            var stats = await this.context.Downloads.Where(d => d.CountryCode == countryCode).GroupBy(d => d.AppId)
                .Select(a => new Stat(a.Key,
                a.Count(d => d.DownloadedAt.Hour < 12),
                a.Count(d => d.DownloadedAt.Hour > 12 && d.DownloadedAt.Hour < 18),
                a.Count(d => d.DownloadedAt.Hour > 19))).ToListAsync();
            var countryStats = new CountryStats(stats);
            return countryStats;
        }
    }
}
