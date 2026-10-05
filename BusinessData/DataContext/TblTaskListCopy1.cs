using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_TaskList_copy1")]
public partial class TblTaskListCopy1
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Point_Person")]
    public int? PointPerson { get; set; }

    [Column("Second_Person")]
    public int? SecondPerson { get; set; }

    [Column("Accountable_Person")]
    public int? AccountablePerson { get; set; }

    public int? Project { get; set; }

    public int? Subproject { get; set; }

    [Column("SubProject_Category")]
    public int? SubProjectCategory { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string Subject { get; set; }

    [StringLength(4000)]
    [Unicode(false)]
    public string Task { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Completed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AssignDate { get; set; }

    [Column("ETA", TypeName = "datetime")]
    public DateTime? Eta { get; set; }

    [Column("ETA_Time")]
    public int? EtaTime { get; set; }

    [Column("Actual_Time")]
    public int? ActualTime { get; set; }

    [Column("Created_Time", TypeName = "datetime")]
    public DateTime? CreatedTime { get; set; }

    [Column("Updated_Time", TypeName = "datetime")]
    public DateTime? UpdatedTime { get; set; }

    public bool IsRecurrent { get; set; }
}
