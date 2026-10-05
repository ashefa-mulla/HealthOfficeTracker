using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Keyless]
public partial class VCtccalculation
{
    public int EmployeeId { get; set; }

    [StringLength(101)]
    [Unicode(false)]
    public string Name { get; set; }

    [Column("Project_id")]
    public int? ProjectId { get; set; }

    [Column("Billable_Client")]
    [StringLength(300)]
    [Unicode(false)]
    public string BillableClient { get; set; }

    [Column("Billable_Task")]
    [StringLength(300)]
    [Unicode(false)]
    public string BillableTask { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string Task { get; set; }

    public DateOnly? LogDate { get; set; }

    [Column("ETA_WorkTime")]
    [StringLength(7)]
    [Unicode(false)]
    public string EtaWorkTime { get; set; }

    [Column("Actual_WorkTime")]
    [StringLength(7)]
    [Unicode(false)]
    public string ActualWorkTime { get; set; }

    [Column("ETA")]
    public int? Eta { get; set; }

    public int? Actual { get; set; }

    [Column(TypeName = "decimal(33, 6)")]
    public decimal? BillableRate { get; set; }

    [Column(TypeName = "decimal(33, 6)")]
    public decimal? CostToCompany { get; set; }

    [Column(TypeName = "decimal(34, 6)")]
    public decimal? CompanyProfit { get; set; }
}
