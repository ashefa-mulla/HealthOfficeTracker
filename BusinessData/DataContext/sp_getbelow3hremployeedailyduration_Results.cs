using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getbelow3hremployeedailyduration_Results
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Total_Duration { get; set; }
        public DateTime? Start_Time { get; set; }
        public DateTime? End_Time { get; set; }
    }
}
