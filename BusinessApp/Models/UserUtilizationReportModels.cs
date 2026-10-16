using System;

namespace BusinessApp.Models
{
    public class UserUtilizationSummaryItem
    {
        public int RowNo { get; set; }
        public string Fullname { get; set; }
        public int BillableSec { get; set; }
        public int NonBillableSec { get; set; }
        public int VoBillableSec { get; set; }
        public int TotalSec { get; set; }
        public string BillableHours { get; set; }
        public string NonBillableHours { get; set; }
        public string VoBillableHours { get; set; }
        public string TotalHours { get; set; }
        public double BillableHoursDec { get; set; }
        public double NonBillableHoursDec { get; set; }
        public double VoBillableHoursDec { get; set; }
        public double TotalHoursDec { get; set; }
        public double BillablePercentage { get; set; }
        public string BillablePercentageFormatted { get; set; }
    }

    public class EmployeeProjectBreakupItem
    {
        public int RowNo { get; set; }
        public string Project { get; set; }
        public int EmployeeId { get; set; }
        public string Fullname { get; set; }
        public int BillableSec { get; set; }
        public int NonBillableSec { get; set; }
        public int TotalSec { get; set; }
        public string BillableHours { get; set; }
        public string NonBillableHours { get; set; }
        public string TotalHours { get; set; }
        public double BillableHoursDec { get; set; }
        public double NonBillableHoursDec { get; set; }
        public double TotalHoursDec { get; set; }
    }
}
