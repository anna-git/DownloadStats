using DownloadStats.Database;
using DownloadStats.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text.RegularExpressions;
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
        public async Task Init()
        {
            if (context.CountriesGeoCoordinates.Any())
                return;
            File.Exists(@"countriescoordinates.csv");
            File.Exists(@"..\\countriescoordinates.csv");
            var lines = File.ReadAllLines(@"..\\countriescoordinates.csv");
            var cd = lines.Select(l =>
            {
                var parts = l.Replace("\t", " ").Split(",");
                return new CountriesGeoCoordinates(parts[0].Trim(), double.Parse(parts[1].Trim()), double.Parse(parts[2].Trim()), parts[3].Trim());
            });
            await context.CountriesGeoCoordinates.AddRangeAsync(cd);
            await context.SaveChangesAsync();
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
        public async Task<IEnumerable<Download>> Get() => await context.Downloads.ToListAsync();
        public async Task<IEnumerable<Stats>> GetMain(int number)
        {
            var downloadsStats = await context.Downloads.GroupBy(e => e.CountryCode).OrderByDescending(e => e.Count()).Take(number).Select(e =>

                new Stats(e.Count(), e.Key, e.Count(d => d.DownloadedAt.Hour < 12), e.Count(d => d.DownloadedAt.Hour > 12 && d.DownloadedAt.Hour < 18), e.Count(d => d.DownloadedAt.Hour > 18))).ToListAsync();

            return downloadsStats;
        }

    }
}
