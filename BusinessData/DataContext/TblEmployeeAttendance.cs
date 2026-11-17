using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_Attendance")]
public partial class TblEmployeeAttendance
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Emp_ID")]
    public int EmpId { get; set; }

    public int Month { get; set; }

    public int? Year { get; set; }

    [Column("Working_Days", TypeName = "decimal(18, 0)")]
    public decimal? WorkingDays { get; set; }

    [Column("Attendance", TypeName = "decimal(18, 0)")]
    public decimal? Attendance { get; set; }

    [Column("PL", TypeName = "decimal(18, 0)")]
    public decimal? Pl { get; set; }

    [Column("CL", TypeName = "decimal(18, 0)")]
    public decimal? Cl { get; set; }

    [Column("SL", TypeName = "decimal(18, 0)")]
    public decimal? Sl { get; set; }

    [Column("updated_by")]
    public int? UpdatedBy { get; set; }

    [Column("updated_date", TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }
    public bool? IsApproved { get; set; }
}

