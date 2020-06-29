using DownloadStats.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Services
{
    public interface IDownloadRepository
    {
        Task Add(Download download);
    }
}
