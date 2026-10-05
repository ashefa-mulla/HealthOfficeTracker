using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_Hourlyrate")]
public partial class TblEmployeeHourlyrate
{
    [Key]
    public int Id { get; set; }

    [Column("Employee_Id")]
    public int EmployeeId { get; set; }

    [Column("Rateper_Hour", TypeName = "decimal(18, 2)")]
    public decimal? RateperHour { get; set; }

    [Column("Effective_Date", TypeName = "datetime")]
    public DateTime? EffectiveDate { get; set; }

    [Required]
    [Column("Updated_By")]
    [StringLength(100)]
    [Unicode(false)]
    public string UpdatedBy { get; set; }

    [Column("Updated_Date", TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }
}
