using DownloadStats.Domain.Stats;
using System;
using System.Collections.Generic;
using Xunit;

namespace DownloadStats.Tests
{
    /// <summary>
    /// check that our domain class stats classifies rightly times to categories of time of day (morning, afternoon, evening, night...)
    /// </summary>
    public class StatTest
    {
        public static readonly object[][] Dates = new object[][]
        {
            new object[]{ new List<DateTime>{
                new DateTime(2010, 01, 02, 9, 30, 0),//m
                new DateTime(2010, 01, 02, 10, 31, 0),//m
                new DateTime(2020, 02, 04, 11, 31, 0),//m
                new DateTime(2021, 09, 03, 22, 31, 0),//e
                new DateTime(2010, 01, 02, 23, 31, 0),//n
                new DateTime(2012, 01, 02, 4, 31, 0),//n
                new DateTime(2016, 01, 02, 7, 31, 0) //m
            }, 4, 0, 1, 2 },
            new object[]{
                new List<DateTime>{
                new DateTime(2021, 01, 02, 9, 30, 0),//m
                new DateTime(2020, 01, 02, 6, 31, 0),//n
                new DateTime(2019, 02, 04, 1, 31, 0),//n
                new DateTime(2018, 09, 03, 00, 0, 0),//n
                new DateTime(2020, 01, 02, 13, 0, 0),//a
                new DateTime(2016, 01, 02, 15, 31, 0),//a
                new DateTime(2007, 01, 02, 7, 31, 0), //m
                new DateTime(2007, 01, 02, 8, 31, 0) //m
            }, 3, 2, 0, 3            },
              new object[]{
                new List<DateTime>{
                new DateTime(2021, 01, 02, 19, 30, 0),//e
                new DateTime(2020, 01, 02, 6, 31, 0),//n
                new DateTime(2019, 02, 04, 1, 31, 0),//n
                new DateTime(2018, 09, 03, 00, 0, 0),//n
                new DateTime(2020, 01, 02, 13, 0, 0),//a
                new DateTime(2016, 01, 02, 16, 31, 0),//a
                new DateTime(2007, 01, 02, 7, 31, 0), //m
                new DateTime(2007, 01, 02, 8, 31, 0) //m
            }, 2, 2, 1, 3 }
        };


        [Theory]
        [MemberData(nameof(Dates))]
        public void TestDownload(IEnumerable<DateTime> dates, int morning, int afternoon, int evening, int night)
        {
            Stat res = new Stat("test", dates);
            Assert.Equal(morning, res.Morning);
            Assert.Equal(afternoon, res.Afternoon);
            Assert.Equal(evening, res.Evening);
            Assert.Equal(night, res.Night);
        }
    }
}
