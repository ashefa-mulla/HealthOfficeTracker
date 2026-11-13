using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_AllowanceMaster")]
[Index("AllowanceCode", Name = "UQ_AllowanceCode", IsUnique = true)]
public partial class TblAllowanceMaster
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Required]
    [StringLength(150)]
    [Unicode(false)]
    public string AllowanceName { get; set; }

    [Required]
    [StringLength(50)]
    [Unicode(false)]
    public string AllowanceCode { get; set; }

    [Required]
    [StringLength(1)]
    [Unicode(false)]
    public string AllowanceType { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string Description { get; set; }

    public bool IsTaxable { get; set; }

    public bool IsFixed { get; set; }

    [Required]
    [StringLength(20)]
    [Unicode(false)]
    public string CalculationType { get; set; }

    [Column("IsLOPApplicable")]
    public bool IsLopapplicable { get; set; }

    public bool IsActive { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [InverseProperty("Allowance")]
    public virtual ICollection<TblEmployeeMonthlyAllowance> TblEmployeeMonthlyAllowances { get; set; } = new List<TblEmployeeMonthlyAllowance>();
}
