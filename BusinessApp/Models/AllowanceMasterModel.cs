using System;

namespace BusinessApp.Models
{
    public class AllowanceMasterModel
    {
        public long Id { get; set; }
        public string AllowanceName { get; set; }
        public string AllowanceCode { get; set; }
        public string AllowanceType { get; set; }
        public string Description { get; set; }
        public bool IsTaxable { get; set; }
        public bool IsFixed { get; set; }
        public string CalculationType { get; set; }
        public bool IsLopapplicable { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsMonthlyAllowance { get; set; }
    }
}
