using DownloadStats.Database;
using DownloadStats.Domain;
using System;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public class DownloadRepository : IDownloadRepository
    {
        private readonly Context context;

        public DownloadRepository(Context context)
        {
            this.context = context;
        }
        public async Task Add(Download download)
        {
            await context.Downloads.AddAsync(download);
            await context.SaveChangesAsync();
        }
    }
}
