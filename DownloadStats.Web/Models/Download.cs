using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Web.Models
{
    public class Download
    {
        [Required]
        public string AppId { get;  set; }

        public double Latitude { get;  set; }
        public double Longitude { get;  set; }
        public DateTime DownloadedAt { get;  set; }
    }
}
