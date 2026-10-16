using System;

namespace BusinessApp.Models
{
    public class MonthlyEvaluationReportSummaryItem
    {
        public int RowNo { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string ProfileImage { get; set; }
        public int Week1 { get; set; }
        public int Week2 { get; set; }
        public int Week3 { get; set; }
        public int Week4 { get; set; }
        public int GrandTotal { get; set; }
    }
}
