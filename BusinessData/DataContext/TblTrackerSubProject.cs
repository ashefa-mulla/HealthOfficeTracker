using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_TrackerSubProject")]
public partial class TblTrackerSubProject
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Company_id")]
    public int? CompanyId { get; set; }

    [Column("Branch_id")]
    public int? BranchId { get; set; }

    [Column("Project_id")]
    public int? ProjectId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Subcategory { get; set; }

    [Unicode(false)]
    public string Description { get; set; }

    [Column("amount", TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    public bool? Active { get; set; }

    public bool? ProjectActive { get; set; }

    [Column("Project_Category")]
    public int? ProjectCategory { get; set; }

    public bool? IsBillable { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AssignDate { get; set; }

    [Column("ETA", TypeName = "datetime")]
    public DateTime? Eta { get; set; }

    [Column("ETATimebyproject")]
    [StringLength(10)]
    [Unicode(false)]
    public string Etatimebyproject { get; set; }
}
