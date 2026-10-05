using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Keyless]
[Table("Tbl_ProjectedvsActual_dlt")]
public partial class TblProjectedvsActualDlt
{
    [Column("ID")]
    [StringLength(255)]
    public string Id { get; set; }

    [Column("Project_id")]
    [StringLength(255)]
    public string ProjectId { get; set; }

    [Column("Start_date")]
    [StringLength(255)]
    public string StartDate { get; set; }

    [StringLength(255)]
    public string Pmonth { get; set; }

    [StringLength(255)]
    public string Pyear { get; set; }

    [Column("Projected_income")]
    [StringLength(255)]
    public string ProjectedIncome { get; set; }

    [Column("Actual_income")]
    [StringLength(255)]
    public string ActualIncome { get; set; }
}
