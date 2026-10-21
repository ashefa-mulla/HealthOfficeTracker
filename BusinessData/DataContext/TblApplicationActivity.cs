using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_ApplicationActivities")]
[Index("IsInMeeting", Name = "IX_ApplicationActivities_IsInMeeting")]
[Index("MeetingActivityId", Name = "IX_ApplicationActivities_MeetingActivityId")]
[Index("MeetingPlatform", Name = "IX_ApplicationActivities_MeetingPlatform")]
[Index("ActivityId", Name = "UQ_ApplicationActivities_ActivityId", IsUnique = true)]
public partial class TblApplicationActivity
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

    [Required]
    [StringLength(255)]
    public string ApplicationName { get; set; }

    [Required]
    [StringLength(255)]
    public string ProcessName { get; set; }

    [StringLength(1000)]
    public string WindowTitle { get; set; }

    public int DurationSeconds { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ReceivedAtUtc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAtUtc { get; set; }

    [StringLength(50)]
    public string MeetingPlatform { get; set; }

    public bool? IsInMeeting { get; set; }

    public Guid? MeetingActivityId { get; set; }

    [ForeignKey("DeviceId")]
    [InverseProperty("TblApplicationActivities")]
    public virtual TblDevice Device { get; set; }
}
