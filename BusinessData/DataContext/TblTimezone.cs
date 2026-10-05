using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Timezone")]
public partial class TblTimezone
{
    [Column("id", TypeName = "numeric(3, 0)")]
    public decimal Id { get; set; }

    [Key]
    [Column("name_of_time_zone")]
    [StringLength(60)]
    [Unicode(false)]
    public string NameOfTimeZone { get; set; }

    [Required]
    [Column("time_zone_time")]
    [StringLength(70)]
    [Unicode(false)]
    public string TimeZoneTime { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string Offset { get; set; }

    [InverseProperty("TimezoneNavigation")]
    public virtual ICollection<TblCompany> TblCompanies { get; set; } = new List<TblCompany>();

    [InverseProperty("TimezoneNavigation")]
    public virtual ICollection<TblEmployer> TblEmployers { get; set; } = new List<TblEmployer>();
}
