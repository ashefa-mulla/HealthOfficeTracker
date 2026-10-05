using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace BusinessApp.Models
{
    public class ProjectedvsActualModel
    {
        [Column("ID")]
        public int Id { get; set; }
        [Column("Project_id")]
        public int? ProjectId { get; set; }
        [Column("Start_date", TypeName = "datetime")]
        public DateTime? StartDate { get; set; }
        [StringLength(2)]
        public string Pmonth { get; set; }
        [StringLength(4)]
        public string Pyear { get; set; }
        [Column("Projected_income", TypeName = "decimal(8, 2)")]
        public decimal? ProjectedIncome { get; set; }
        [Column("Actual_income", TypeName = "decimal(8, 2)")]
        public decimal? ActualIncome { get; set; }

    }
}
