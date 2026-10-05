using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Keyless]
public partial class VEmptasklist
{
    public int EmployeeId { get; set; }

    [StringLength(101)]
    [Unicode(false)]
    public string Fullname { get; set; }

    public DateOnly? TaskDate { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Project { get; set; }

    [Column("subproject")]
    [StringLength(300)]
    [Unicode(false)]
    public string Subproject { get; set; }

    [Column("category")]
    [StringLength(300)]
    [Unicode(false)]
    public string Category { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string Task { get; set; }

    public int TaskStatus { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Status { get; set; }
}
