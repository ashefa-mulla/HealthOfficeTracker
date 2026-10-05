using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getdailyemployeematrixlist
    {
        public int Id { get; set; }
        public int Employee_id { get; set; }
        public int? Template_id { get; set; }
        public string Column_name { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Comments { get; set; }
    }
}
