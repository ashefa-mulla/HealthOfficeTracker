using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_TrackerProject")]
public partial class TblTrackerProject
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Company_id")]
    public int? CompanyId { get; set; }

    [Column("Branch_id")]
    public int? BranchId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Project { get; set; }

    [Column("Project_Description")]
    [Unicode(false)]
    public string ProjectDescription { get; set; }

    [Column("vendor_company")]
    [StringLength(100)]
    [Unicode(false)]
    public string VendorCompany { get; set; }

    [Column("Person_name")]
    [StringLength(100)]
    [Unicode(false)]
    public string PersonName { get; set; }

    [Column("Address_Line1")]
    [StringLength(255)]
    [Unicode(false)]
    public string AddressLine1 { get; set; }

    [Column("Address_Line2")]
    [StringLength(255)]
    [Unicode(false)]
    public string AddressLine2 { get; set; }

    [Column("City_ID")]
    public int? CityId { get; set; }

    [Column("State_ID")]
    public int? StateId { get; set; }

    [Column("Country_ID")]
    public int? CountryId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string Zip { get; set; }

    public bool? Active { get; set; }
}
