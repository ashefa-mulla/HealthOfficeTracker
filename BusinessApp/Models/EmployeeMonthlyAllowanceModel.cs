using System;
using Newtonsoft.Json;

namespace BusinessApp.Models
{
    public class EmployeeMonthlyAllowanceModel
    {
        public long Id { get; set; }

        public int EmpId { get; set; }

        [JsonProperty("emp_id")]
        public int? EmpIdUnderscore
        {
            get => null;
            set
            {
                if (value.HasValue)
                {
                    EmpId = value.Value;
                }
            }
        }

        [JsonProperty("Emp_ID")]
        public int? EmpIdUpperUnderscore
        {
            get => null;
            set
            {
                if (value.HasValue)
                {
                    EmpId = value.Value;
                }
            }
        }

        public long AllowanceId { get; set; }

        [JsonProperty("allowance_id")]
        public long? AllowanceIdUnderscore
        {
            get => null;
            set
            {
                if (value.HasValue)
                {
                    AllowanceId = value.Value;
                }
            }
        }

        [JsonProperty("AllowanceID")]
        public long? AllowanceIdUpper
        {
            get => null;
            set
            {
                if (value.HasValue)
                {
                    AllowanceId = value.Value;
                }
            }
        }

        public int Month { get; set; }

        public int Year { get; set; }

        public decimal Amount { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Display properties
        public string EmployeeName { get; set; }
        public string AllowanceName { get; set; }
        public string AllowanceCode { get; set; }
        public string AllowanceType { get; set; }

        public bool ShouldSerializeEmpIdUnderscore() => false;
        public bool ShouldSerializeEmpIdUpperUnderscore() => false;
        public bool ShouldSerializeAllowanceIdUnderscore() => false;
        public bool ShouldSerializeAllowanceIdUpper() => false;
    }
}
