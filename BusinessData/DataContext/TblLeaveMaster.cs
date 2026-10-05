using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_LeaveMaster")]
public partial class TblLeaveMaster
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("AC_Year")]
    public int AcYear { get; set; }

    [Column("Emp_ID")]
    public int EmpId { get; set; }

    [Column("Assign_Leaves", TypeName = "decimal(18, 0)")]
    public decimal AssignLeaves { get; set; }

    [Column("Used_Leaves", TypeName = "decimal(18, 0)")]
    public decimal? UsedLeaves { get; set; }

    [Column("Balance_Leaves", TypeName = "decimal(18, 0)")]
    public decimal? BalanceLeaves { get; set; }

    [Column("Assign_Sick_Leaves", TypeName = "decimal(18, 0)")]
    public decimal? AssignSickLeaves { get; set; }

    [Column("Used_Sick_Leaves", TypeName = "decimal(18, 0)")]
    public decimal? UsedSickLeaves { get; set; }

    [Column("Balance_Sick_Leaves", TypeName = "decimal(18, 0)")]
    public decimal? BalanceSickLeaves { get; set; }

    [Column("LWP", TypeName = "decimal(18, 0)")]
    public decimal? Lwp { get; set; }

    [Column("updated_by")]
    public int? UpdatedBy { get; set; }

    [Column("updated_date", TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }
}
