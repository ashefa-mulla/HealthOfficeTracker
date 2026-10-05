using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_PunchDetail")]
public partial class TblPunchDetail
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("employee_id")]
    public int EmployeeId { get; set; }

    [Column("shift_dt")]
    public DateOnly ShiftDt { get; set; }

    [Column("branch")]
    public int Branch { get; set; }

    [Column("shift_start_time", TypeName = "datetime")]
    public DateTime ShiftStartTime { get; set; }

    [Column("shift_end_time", TypeName = "datetime")]
    public DateTime? ShiftEndTime { get; set; }

    [Column("shift_hours", TypeName = "numeric(5, 3)")]
    public decimal? ShiftHours { get; set; }

    [Column("break_hours", TypeName = "datetime")]
    public DateTime? BreakHours { get; set; }

    [Column("total_hours", TypeName = "numeric(5, 3)")]
    public decimal? TotalHours { get; set; }

    [Column("enter_by")]
    public int? EnterBy { get; set; }

    [Column("ip_add_in")]
    [StringLength(20)]
    [Unicode(false)]
    public string IpAddIn { get; set; }

    [Column("ip_add_out")]
    [StringLength(20)]
    [Unicode(false)]
    public string IpAddOut { get; set; }

    [Column("location")]
    [StringLength(50)]
    [Unicode(false)]
    public string Location { get; set; }

    [Column("zip")]
    [StringLength(20)]
    [Unicode(false)]
    public string Zip { get; set; }

    [Column("state_id")]
    public int? StateId { get; set; }

    [Column("country_id")]
    public int? CountryId { get; set; }

    [Required]
    [Column("longitude")]
    [StringLength(50)]
    [Unicode(false)]
    public string Longitude { get; set; }

    [Required]
    [Column("latitude")]
    [StringLength(50)]
    [Unicode(false)]
    public string Latitude { get; set; }

    [StringLength(70)]
    [Unicode(false)]
    public string CaptureImg { get; set; }

    [Column("updated_by")]
    public int? UpdatedBy { get; set; }

    [Column("manual_updated")]
    public bool? ManualUpdated { get; set; }

    [Column("created_date", TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [Column("updated_date", TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    [Column("event_id")]
    public int? EventId { get; set; }

    [StringLength(70)]
    [Unicode(false)]
    public string OutCaptureImg { get; set; }
}
