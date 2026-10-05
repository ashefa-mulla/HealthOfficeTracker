using System;

namespace BusinessApp.Models
{
    public class LeaveTransaction
    {
        public int ID { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public System.DateTime FromDate { get; set; }
        public System.DateTime ToDate { get; set; }
        public int EmpId { get; set; }
        public Nullable<decimal> Leaves { get; set; }
        public Nullable<decimal> SickLeaves { get; set; }
        public Nullable<decimal> PL { get; set; }
        public Nullable<decimal> SL { get; set; }
        public Nullable<decimal> LWP { get; set; }
        public Nullable<decimal> PLeaves { get; set; }
        public bool IsApprove { get; set; }
        public bool isSickLeaves { get; set; }
    }
}
