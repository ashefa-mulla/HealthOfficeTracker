using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getadminprojectsummaryfordashboard_Results
    {
        public string Person { get; set; }
        public string Project { get; set; }
        public int SubprojectCount { get; set; }
        public string SubprojectCategory { get; set; }
        public int TaskCount { get; set; }
        public decimal? BillableHours { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? NonBillableHours { get; set; }
    }
}
