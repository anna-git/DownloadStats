using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Database
{
    public static class RegisterDataServicesExtensions
    {
        public static void RegisterDataServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<Context>(options => options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));
        }
    }
}
