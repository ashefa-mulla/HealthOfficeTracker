using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class POReferanceDocument
    {
        public int ID { get; set; }
        public Nullable<int> POID { get; set; }
        public string ReferanceDocument { get; set; }
    }
}
