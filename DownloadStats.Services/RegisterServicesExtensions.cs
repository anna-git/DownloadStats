using DownloadStats.Database;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public static class RegisterServicesExtensions
    {
        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHostedService<Feeder>();
            services.AddScoped<IDownloadRepository, DownloadRepository>();
            services.RegisterDataServices(configuration);
        }
    }
}
