using System;
using Newtonsoft.Json;

namespace BusinessApp.Models
{
    public class EmployeeAttendanceModel
    {
        public int Id { get; set; }

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

        public bool ShouldSerializeEmpIdUnderscore() => false;

        public int Month { get; set; }

        public int? Year { get; set; }

        public decimal? WorkingDays { get; set; }

        public decimal? Attendance { get; set; }

        public decimal? Pl { get; set; }

        public decimal? Cl { get; set; }

        public decimal? Sl { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

