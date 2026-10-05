using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_BankMaster")]
public partial class TblBankMaster
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column(TypeName = "numeric(18, 0)")]
    public decimal AccountNo { get; set; }

    [Required]
    [StringLength(70)]
    [Unicode(false)]
    public string Name { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? OpeningDate { get; set; }

    public bool? Active { get; set; }
}
