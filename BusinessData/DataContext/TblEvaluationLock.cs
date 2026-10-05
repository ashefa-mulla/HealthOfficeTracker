using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_EvaluationLock")]
[Index("EmployeeId", "EvalYear", "EvalMonth", Name = "IDX_EvalLock")]
public partial class TblEvaluationLock
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("EmployeeID")]
    public int EmployeeId { get; set; }

    public int EvalYear { get; set; }

    public int EvalMonth { get; set; }

    public bool IsLocked { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LockedAt { get; set; }

    public int? LockedBy { get; set; }
}
