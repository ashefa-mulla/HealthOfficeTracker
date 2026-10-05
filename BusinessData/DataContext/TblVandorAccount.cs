using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_VandorAccount")]
public partial class TblVandorAccount
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("CategoryID")]
    public int? CategoryId { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string Name { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Address { get; set; }

    [Column(TypeName = "numeric(15, 0)")]
    public decimal? Contact { get; set; }

    [Column("EmailID")]
    [StringLength(256)]
    [Unicode(false)]
    public string EmailId { get; set; }

    public bool Active { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string OtherInformation { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("TblVandorAccounts")]
    public virtual TblAccountCategory Category { get; set; }

    [InverseProperty("VandorAccount")]
    public virtual ICollection<TblVandorAccountNumber> TblVandorAccountNumbers { get; set; } = new List<TblVandorAccountNumber>();
}
