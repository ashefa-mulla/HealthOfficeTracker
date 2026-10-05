using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_TrackerSubProjectCategory")]
public partial class TblTrackerSubProjectCategory
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
    public string Subcategory { get; set; }

    [Unicode(false)]
    public string Description { get; set; }

    [Column("amount", TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    public bool? Active { get; set; }

    [Column("Subproject_id")]
    public int? SubprojectId { get; set; }

    [Column("Project_id")]
    public int? ProjectId { get; set; }

    public bool? ProjectActive { get; set; }
}
