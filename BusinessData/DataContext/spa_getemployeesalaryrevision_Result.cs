using System;

namespace BusinessData.DataContext
{
    public partial class spa_getemployeesalaryrevision_Result
    {
        public long ID { get; set; }
        public int EmployeeID { get; set; }
        public string Fullname { get; set; }
        public decimal Basic { get; set; }
        public decimal Matrix { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int SeqNo { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
        public string Status { get; set; }
    }
}

