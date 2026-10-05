using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_ChequeRequest")]
public partial class TblChequeRequest
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Bank_ID")]
    public int BankId { get; set; }

    public DateOnly RequestDate { get; set; }

    [Required]
    [StringLength(100)]
    [Unicode(false)]
    public string PayTo { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Memo { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string Address { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    [Column("CostCenter_id")]
    public int? CostCenterId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string PayMethod { get; set; }
}
