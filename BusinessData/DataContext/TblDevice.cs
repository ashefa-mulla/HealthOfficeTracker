using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Devices")]
public partial class TblDevice
{
    [Key]
    public Guid DeviceId { get; set; }

    [Required]
    [StringLength(255)]
    public string MachineName { get; set; }

    [StringLength(255)]
    public string WindowsUserName { get; set; }

    [StringLength(255)]
    public string DisplayName { get; set; }

    [StringLength(50)]
    public string AgentVersion { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime RegisteredAtUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastHeartbeatUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastSyncUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAtUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAtUtc { get; set; }

    [InverseProperty("Device")]
    public virtual ICollection<TblApplicationActivity> TblApplicationActivities { get; set; } = new List<TblApplicationActivity>();

    [InverseProperty("Device")]
    public virtual ICollection<TblIdleActivity> TblIdleActivities { get; set; } = new List<TblIdleActivity>();

    [InverseProperty("Device")]
    public virtual ICollection<TblSyncLog> TblSyncLogs { get; set; } = new List<TblSyncLog>();
}
