using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_SyncLogs")]
public partial class TblSyncLog
{
    [Key]
    public long Id { get; set; }

    public Guid DeviceId { get; set; }

    public int EmployeeId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime SyncStartedUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? SyncCompletedUtc { get; set; }

    public int RecordsReceived { get; set; }

    public int RecordsInserted { get; set; }

    public int RecordsDuplicate { get; set; }

    public int RecordsFailed { get; set; }

    public bool IsSuccessful { get; set; }

    [StringLength(2000)]
    public string ErrorMessage { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAtUtc { get; set; }

    [ForeignKey("DeviceId")]
    [InverseProperty("TblSyncLogs")]
    public virtual TblDevice Device { get; set; }
}
