using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    public class sp_GetEmployeeMonthlyAllowance_Result
    {
        public long ID { get; set; }
        public long AllowanceID { get; set; }
        public int EmpID { get; set; }
        public string AllowanceName { get; set; }
        public decimal Amount { get; set; }

        [NotMapped]
        public int? Month { get; set; }

        [NotMapped]
        public int? Year { get; set; }
    }
}
