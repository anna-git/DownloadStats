using Castle.Core.Configuration;
using DownloadStats.Database;
using DownloadStats.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DownloadStats.Tests
{
    public class DownloadRepositoryTest
    {
        private readonly DownloadRepository downloadRepo;

        public DownloadRepositoryTest()
        {
            var c = new Mock<Context>(new DbContextOptionsBuilder().Options);
            Mock<Microsoft.Extensions.Configuration.IConfiguration> conf = MockConfig();
            var dl = new Mock<DownloadRepository>(c.Object, conf.Object);
            this.downloadRepo = dl.Object;
        }

        private static Mock<Microsoft.Extensions.Configuration.IConfiguration> MockConfig()
        {
            var conf = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            var s = new Mock<IConfigurationSection>(MockBehavior.Loose);
            conf.Setup(e => e.GetSection(It.IsAny<string>())).Returns(() => s.Object);
            s.Setup(e => e.GetSection(It.IsAny<string>())).Returns(s.Object);
            s.SetupGet(e => e.Value).Returns("");
            return conf;
        }

        [Fact]
        public async Task Test1Async()
        {
            var res  = await this.downloadRepo.Add("wrong", It.IsAny<double>(), It.IsAny<double>(), It.IsAny<DateTime>());
            Assert.False(res.HasValue);
            Assert.Equal("app id must be one of these values: Empatica care, Alert for embrace, E4 realtime, Mate for Embrace, Empatica2, Empatica3, Empatica4", res.Explanation);
        }
    }
}
