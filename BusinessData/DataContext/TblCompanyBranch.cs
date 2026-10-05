using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_CompanyBranch")]
public partial class TblCompanyBranch
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Column("Company_ID")]
    public int CompanyId { get; set; }

    public int? Timezone { get; set; }

    [Column("WorkingHRS")]
    [StringLength(20)]
    [Unicode(false)]
    public string WorkingHrs { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string OverTime { get; set; }

    [Column("dateformat")]
    [StringLength(20)]
    [Unicode(false)]
    public string Dateformat { get; set; }
}
