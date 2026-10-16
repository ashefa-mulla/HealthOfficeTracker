using System;

namespace BusinessApp.Models
{
    public class UserPerUtilizationSummaryItem
    {
        public int RowNo { get; set; }
        public string EmployeeId { get; set; }
        public string EmpName { get; set; }
        public string FixedWorkingHours { get; set; }
        public string BillableHours { get; set; }
        public string NonBillableHours { get; set; }
        public string VoProduction { get; set; }
        public string TotalHours { get; set; }
        public string UtilizePer { get; set; }
        public bool IsTracked { get; set; }
    }
}
