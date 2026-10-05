using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class GetUtilizationReportDetailwithProjectbyEmployee_Result
    {
        public int ID { get; set; }
        public string Fullname { get; set; }
        public string OExecDate { get; set; }
        public string Starttime { get; set; }
        public string OOutDate { get; set; }
        public string Endtime { get; set; }
        public string Duratin { get; set; }
        public Nullable<System.DateTime> Updated_date { get; set; }
        public string Project { get; set; }
        public string Subcategory { get; set; }
        public string subprojectcategory { get; set; }
        public string Activity { get; set; }
        public Nullable<int> SecondValue { get; set; }
        public Nullable<decimal> VORateperHour { get; set; }
        public int PID { get; set; }
        public Nullable<decimal> InvoiceedRateperHour { get; set; }
        public Nullable<decimal> CompanyCost { get; set; }
        public Nullable<decimal> InvoicedAmount { get; set; }

    }
}
