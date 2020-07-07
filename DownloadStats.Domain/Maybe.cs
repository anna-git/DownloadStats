using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadStats.Domain
{
    public class Maybe<T> where T:class
    {
        public Maybe(T value)
        {
            this.Value = value;
        }
        public Maybe(string explanation)
        {
            this.Explanation = explanation;
        }
        public T? Value { get; }
        public bool HasValue => Value != null;
        public string? Explanation { get; }
    }
}
