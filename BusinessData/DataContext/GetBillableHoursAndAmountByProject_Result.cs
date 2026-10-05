using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class GetBillableHoursAndAmountByProject_Result
    {
        public int Project_id { get; set; }
        public string Project { get; set; }
        public string Project_Description { get; set; }
        public decimal Total_Billable_Hours { get; set; }
        public decimal Total_Amount { get; set; }
    }

}
