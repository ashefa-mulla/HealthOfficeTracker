using System;

namespace BusinessApp.Models
{
    public class LeaveTransactionReportItem
    {
        public int RowNo { get; set; }
        public int Id { get; set; }
        public int EmpId { get; set; }
        public string Employee { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string LeaveDateRange { get; set; }
        public double Leaves { get; set; }
        public double SickLeaves { get; set; }
        public double Lwp { get; set; }
        public double TotalLeave { get; set; }
        public string LeavesDisplay { get; set; }
        public string SickLeavesDisplay { get; set; }
        public string LwpDisplay { get; set; }
        public string TotalLeaveDisplay { get; set; }
        public bool? IsApprove { get; set; }
        public string ApprovedText { get; set; }
    }
}
