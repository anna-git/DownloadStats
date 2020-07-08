using System;
using System.ComponentModel.DataAnnotations;

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
