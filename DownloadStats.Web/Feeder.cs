using DownloadStats.Services;
using DownloadStats.Web.Controllers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DownloadStats.Web
{
    public class Feeder : IHostedService
    {
        private readonly int _frequency;
        private readonly IServiceProvider services;
        private readonly IHubContext<Notifier> hubcontext;
        private Timer? _timer = null;
        private readonly string[] AppIds = new string[] { "Empatica care", "Alert for embrace","E4 realtime", "Mate for Embrace", "Empatica2", "Empatica3", "Empatica4"};
        public Feeder(IConfiguration configuration, IServiceProvider serviceProvider, IHubContext<Notifier> hubcontext)
        {
            _frequency = int.Parse(configuration.GetSection("Feeder").Value);
            this.services = serviceProvider;
            this.hubcontext = hubcontext;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            var r = new Random();
            const double maxLat = 90;
            const double maxLon = 180;
            
            if (_frequency > 0)
            {
                _timer = new Timer(async (_) =>
                {
                    using var scope = services.CreateScope();
                    var downloadRepository = scope.ServiceProvider.GetRequiredService<IDownloadRepository>();
                    await downloadRepository.Add(AppIds.ElementAt(r.Next(0, AppIds.Length-1)), r.NextDouble() * maxLat, r.NextDouble() * maxLon, DateTime.Now.AddHours(r.Next(-10,10 )));
                    await hubcontext.Clients.All.SendAsync("new-download");

                }, null, TimeSpan.Zero, TimeSpan.FromSeconds(_frequency));
            }
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;

        }
    }
}
