using System;

namespace BusinessData.DataContext
{
    public partial class spa_getemployeeattendance_Result
    {
        public int ID { get; set; }
        public int EmployeeID { get; set; }
        public string Fullname { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; }
        public int? Year { get; set; }
        public decimal? Working_Days { get; set; }
        public decimal? Attendance { get; set; }
        public decimal? PL { get; set; }
        public decimal? CL { get; set; }
        public decimal? SL { get; set; }
        public decimal? TotalLeaves { get; set; }
        public decimal? LOPDays { get; set; }
        public decimal? PaidDays { get; set; }
        public int? updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public bool?  IsApproved { get; set; }
    }
}

