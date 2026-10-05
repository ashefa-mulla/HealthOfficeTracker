using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getcurrentmonthOutstandingByAdmin_Results
    {
        public decimal? TotalBillableHours { get; set; }
        public decimal? TotalOutstandingAmount { get; set; }
    }
}
