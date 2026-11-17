using System;
using Newtonsoft.Json;

namespace BusinessApp.Models
{
    public class EmployeeSalaryRevisionModel
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

        public decimal Basic { get; set; }

        public decimal Matrix { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public int SeqNo { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool? IsCurrentMonthMatrix { get; set; } = true;

        public bool ShouldSerializeEmpIdUnderscore() => false;
    }
}
