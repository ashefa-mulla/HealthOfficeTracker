using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_LeaveTransaction")]
public partial class TblLeaveTransaction
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    public int? Year { get; set; }

    public int? Month { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FromDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ToDate { get; set; }

    [Column("Emp_id")]
    public int? EmpId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Leaves { get; set; }

    [Column("Sick_Leaves", TypeName = "decimal(18, 2)")]
    public decimal? SickLeaves { get; set; }

    [Column("PL", TypeName = "decimal(18, 2)")]
    public decimal? Pl { get; set; }

    [Column("SL", TypeName = "decimal(18, 2)")]
    public decimal? Sl { get; set; }

    [Column("LWP", TypeName = "decimal(18, 2)")]
    public decimal? Lwp { get; set; }

    [Column("isApprove")]
    public bool? IsApprove { get; set; }
}
