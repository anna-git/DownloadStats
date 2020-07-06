using System.Collections.Generic;
using System.Threading.Tasks;
using DownloadStats.Domain;
using DownloadStats.Services;
using GeekLearning.Domain;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("Stats/{countryCode}")]
        public Task<IEnumerable<Domain.Stats.Stat>> GetStats(string countryCode) => this.downloadRepository.Get(countryCode);


        [HttpGet("Stats")]
        public Task<IEnumerable<Domain.Stats.Stat>> GetStats() => this.downloadRepository.Get();

        [HttpGet]
        public Task<IEnumerable<Download>> Get() => this.downloadRepository.GetAll();


        [HttpPost("Add")]
        public async Task<Maybe<Download>> Add(Models.Download download)
        {
            var dl = await downloadRepository.Add(download.AppId, download.Latitude, download.Longitude, download.DownloadedAt);
            await hubcontext.Clients.All.SendAsync("new-download");
            return dl;
        }
    }
}
