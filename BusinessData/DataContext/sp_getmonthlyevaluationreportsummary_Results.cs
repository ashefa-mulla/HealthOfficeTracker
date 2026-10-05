using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getmonthlyevaluationreportsummary_Results
    {
        public int EmployeeID { get; set; }

        public string EmployeeName { get; set; }

        public string ProfileImage { get; set; }

        public int Week1 { get; set; }

        public int Week2 { get; set; }

        public int Week3 { get; set; }

        public int Week4 { get; set; }

        public int GrandTotal { get; set; }

    }
}
