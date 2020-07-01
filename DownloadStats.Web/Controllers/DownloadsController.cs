using System.Collections.Generic;
using System.Threading.Tasks;
using DownloadStats.Domain;
using DownloadStats.Services;
using Microsoft.AspNetCore.Mvc;

namespace DownloadStats.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DownloadsController : ControllerBase
    {
        private readonly IDownloadRepository downloadRepository;

        public DownloadsController(IDownloadRepository downloadRepository)
        {
            this.downloadRepository = downloadRepository;
        }

        [HttpGet]
        public  Task<IEnumerable<Download>> Get()
        {
            return downloadRepository.Get();
        }
    }
}
