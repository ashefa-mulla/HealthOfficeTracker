using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_SalaryRevision")]
public partial class TblEmployeeSalaryRevision
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("Emp_ID")]
    public int EmpId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Basic { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Matrix { get; set; }

    public DateOnly FromDate { get; set; }

    public DateOnly? ToDate { get; set; }

    public int SeqNo { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public bool IsActive { get; set; }
}
