using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Country")]
public partial class TblCountry
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [StringLength(55)]
    [Unicode(false)]
    public string Name { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string CountryCode { get; set; }

    [InverseProperty("Country")]
    public virtual ICollection<TblCompany> TblCompanies { get; set; } = new List<TblCompany>();

    [InverseProperty("Country")]
    public virtual ICollection<TblEmployer> TblEmployers { get; set; } = new List<TblEmployer>();

    [InverseProperty("Country")]
    public virtual ICollection<TblState> TblStates { get; set; } = new List<TblState>();
}
