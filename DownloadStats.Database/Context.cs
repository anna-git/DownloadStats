using DownloadStats.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Database
{
    public class Context : DbContext
    {
        public Context(DbContextOptions options):base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CountriesGeoCoordinates>(b => b.HasKey(e => e.Code));
            modelBuilder.Entity<Download>(b => b.HasKey(e => e.Id));
        }
        public DbSet<Download> Downloads { get; set; }
        public DbSet<CountriesGeoCoordinates> CountriesGeoCoordinates { get; set; }
    }
}
