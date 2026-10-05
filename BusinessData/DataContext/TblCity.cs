using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_City")]
public partial class TblCity
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    [Unicode(false)]
    public string Name { get; set; }

    [Column("StateID")]
    public int StateId { get; set; }

    [ForeignKey("StateId")]
    [InverseProperty("TblCities")]
    public virtual TblState State { get; set; }

    [InverseProperty("City")]
    public virtual ICollection<TblCompany> TblCompanies { get; set; } = new List<TblCompany>();

    [InverseProperty("City")]
    public virtual ICollection<TblEmployer> TblEmployers { get; set; } = new List<TblEmployer>();
}
