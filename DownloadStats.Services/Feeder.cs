﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public class Feeder : IHostedService
    {
        private readonly int _frequency;
        private readonly IServiceProvider services;
        private Timer _timer;

        public Feeder(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _frequency = int.Parse(configuration.GetSection("Feeder").Value);
            this.services = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            if (_frequency > 0)
            {
                _timer = new Timer(async (_) =>
                {
                    using var scope = services.CreateScope();
                    var downloadRepository = scope.ServiceProvider.GetRequiredService<IDownloadRepository>();
                    await downloadRepository.Add(new Domain.Download(Guid.NewGuid().ToString(), 1, 2, DateTime.Now, "IT"));

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
