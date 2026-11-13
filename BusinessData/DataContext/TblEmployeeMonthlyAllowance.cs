using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_MonthlyAllowance")]
[Index("EmpId", "AllowanceId", "Month", "Year", Name = "UQ_Employee_MonthlyAllowance", IsUnique = true)]
public partial class TblEmployeeMonthlyAllowance
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("Emp_ID")]
    public int EmpId { get; set; }

    [Column("AllowanceID")]
    public long AllowanceId { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("AllowanceId")]
    [InverseProperty("TblEmployeeMonthlyAllowances")]
    public virtual TblAllowanceMaster Allowance { get; set; }
}
