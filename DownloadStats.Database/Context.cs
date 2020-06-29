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
            modelBuilder.Entity<Download>(b => b.HasKey(e => e.AppId));
        }
        public DbSet<Download> Downloads { get; set; }
    }
}
