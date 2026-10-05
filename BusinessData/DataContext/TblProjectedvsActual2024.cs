using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_ProjectedvsActual_2024")]
public partial class TblProjectedvsActual2024
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Project_id")]
    public int? ProjectId { get; set; }

    [Column("Start_date", TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string Pmonth { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string Pyear { get; set; }

    [Column("Projected_income", TypeName = "decimal(8, 2)")]
    public decimal? ProjectedIncome { get; set; }

    [Column("Actual_income", TypeName = "decimal(8, 2)")]
    public decimal? ActualIncome { get; set; }
}
