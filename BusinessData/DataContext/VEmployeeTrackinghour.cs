using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Keyless]
public partial class VEmployeeTrackinghour
{
    [Column("Employee_id")]
    public int? EmployeeId { get; set; }

    [Column("Project_id")]
    public int? ProjectId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Project { get; set; }

    [Column("Subproject_id")]
    public int? SubprojectId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string SubProject { get; set; }

    [Column("Subprojectcategory_id")]
    public int? SubprojectcategoryId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Subcategory { get; set; }

    [Column("Active_Invoice")]
    public bool? ActiveInvoice { get; set; }

    [Column("Start_time", TypeName = "datetime")]
    public DateTime? StartTime { get; set; }

    [Column("End_time", TypeName = "datetime")]
    public DateTime? EndTime { get; set; }

    public bool? IsBillable { get; set; }
}
