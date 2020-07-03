using System.Collections.Generic;
using System.Threading.Tasks;
using DownloadStats.Domain;
using DownloadStats.Domain.Stats;
using DownloadStats.Services;
using Microsoft.AspNetCore.Mvc;
using DownloadStats.Domain.Stats;
using Microsoft.AspNetCore.SignalR;

namespace DownloadStats.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DownloadsController : ControllerBase
    {
        private readonly IDownloadRepository downloadRepository;
        private readonly IHubContext<Notifier> hubcontext;

        public DownloadsController(IDownloadRepository downloadRepository, IHubContext<Notifier> hubcontext)
        {
            this.downloadRepository = downloadRepository;
            this.hubcontext = hubcontext;
        }

        //[HttpGet]
        //public Task<IEnumerable<Stats>> Get(int number = 10) => this.downloadRepository.GetMain(10);

        [HttpGet]
        public Task<IEnumerable<Download>> Get() => this.downloadRepository.GetAll();

        [HttpPost("Add")]
        public async Task<Download> Add(Models.Download download)
        {
            var dl = await downloadRepository.Add(download.AppId, download.Latitude, download.Longitude, download.DownloadedAt);
            await hubcontext.Clients.All.SendAsync("new-download");
            return dl;
        }
    }
}
