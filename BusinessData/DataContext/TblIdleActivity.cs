using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_IdleActivities")]
[Index("ActivityId", Name = "UQ_IdleActivities_ActivityId", IsUnique = true)]
public partial class TblIdleActivity
{
    [Key]
    public long Id { get; set; }

    public Guid ActivityId { get; set; }

    public Guid DeviceId { get; set; }

    public int EmployeeId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime StartTimeUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EndTimeUtc { get; set; }

    public int DurationSeconds { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ReceivedAtUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAtUtc { get; set; }

    [ForeignKey("DeviceId")]
    [InverseProperty("TblIdleActivities")]
    public virtual TblDevice Device { get; set; }
}
