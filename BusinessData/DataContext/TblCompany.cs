using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Company")]
public partial class TblCompany
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [Column("Company_Name")]
    [StringLength(50)]
    [Unicode(false)]
    public string CompanyName { get; set; }

    [Column("address_line1")]
    [StringLength(100)]
    [Unicode(false)]
    public string AddressLine1 { get; set; }

    [Column("address_line2")]
    [StringLength(100)]
    [Unicode(false)]
    public string AddressLine2 { get; set; }

    [Column("city_id")]
    public int? CityId { get; set; }

    [Column("state_id")]
    public int? StateId { get; set; }

    [Column("country_id")]
    public int? CountryId { get; set; }

    [Column("zip")]
    [StringLength(20)]
    [Unicode(false)]
    public string Zip { get; set; }

    [Column("timezone")]
    [StringLength(60)]
    [Unicode(false)]
    public string Timezone { get; set; }

    [Column("primary_contact")]
    [StringLength(20)]
    [Unicode(false)]
    public string PrimaryContact { get; set; }

    [Column("primary_email")]
    [StringLength(256)]
    [Unicode(false)]
    public string PrimaryEmail { get; set; }

    [Column("alternate_contact")]
    [StringLength(20)]
    [Unicode(false)]
    public string AlternateContact { get; set; }

    [Column("alternate_email")]
    [StringLength(256)]
    [Unicode(false)]
    public string AlternateEmail { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string Fax { get; set; }

    [Column("Website_Url")]
    [StringLength(200)]
    [Unicode(false)]
    public string WebsiteUrl { get; set; }

    [ForeignKey("CityId")]
    [InverseProperty("TblCompanies")]
    public virtual TblCity City { get; set; }

    [ForeignKey("CountryId")]
    [InverseProperty("TblCompanies")]
    public virtual TblCountry Country { get; set; }

    [ForeignKey("StateId")]
    [InverseProperty("TblCompanies")]
    public virtual TblState State { get; set; }

    [InverseProperty("Company")]
    public virtual ICollection<TblOrderType> TblOrderTypes { get; set; } = new List<TblOrderType>();

    [ForeignKey("Timezone")]
    [InverseProperty("TblCompanies")]
    public virtual TblTimezone TimezoneNavigation { get; set; }
}
