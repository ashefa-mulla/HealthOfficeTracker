using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_State")]
public partial class TblState
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    [Unicode(false)]
    public string Name { get; set; }

    [Required]
    [StringLength(2)]
    [Unicode(false)]
    public string Code { get; set; }

    [Column("CountryID")]
    public int CountryId { get; set; }

    [ForeignKey("CountryId")]
    [InverseProperty("TblStates")]
    public virtual TblCountry Country { get; set; }

    [InverseProperty("State")]
    public virtual ICollection<TblCity> TblCities { get; set; } = new List<TblCity>();

    [InverseProperty("State")]
    public virtual ICollection<TblCompany> TblCompanies { get; set; } = new List<TblCompany>();

    [InverseProperty("State")]
    public virtual ICollection<TblEmployer> TblEmployers { get; set; } = new List<TblEmployer>();
}
