using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_VandorAccountNumber")]
public partial class TblVandorAccountNumber
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("VandorAccountID")]
    public int? VandorAccountId { get; set; }

    [Column(TypeName = "numeric(18, 0)")]
    public decimal? AccountNo { get; set; }

    [ForeignKey("VandorAccountId")]
    [InverseProperty("TblVandorAccountNumbers")]
    public virtual TblVandorAccount VandorAccount { get; set; }
}
