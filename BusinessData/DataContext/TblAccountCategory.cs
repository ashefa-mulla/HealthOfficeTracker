using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_AccountCategory")]
public partial class TblAccountCategory
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; }

    public bool Active { get; set; }

    [InverseProperty("Category")]
    public virtual ICollection<TblVandorAccount> TblVandorAccounts { get; set; } = new List<TblVandorAccount>();
}
