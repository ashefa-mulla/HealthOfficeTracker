using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_ProfessionalTaxSlab")]
public partial class TblProfessionalTaxSlab
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal StartRange { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? EndRange { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal MonthlyAmount { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }
}
