using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_ToptrackerTask")]
public partial class TblToptrackerTask
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Company_id")]
    public int? CompanyId { get; set; }

    [Column("Branch_id")]
    public int? BranchId { get; set; }

    [Column("Employee_id")]
    public int? EmployeeId { get; set; }

    [Column("Project_id")]
    public int? ProjectId { get; set; }

    [Column("Subproject_id")]
    public int? SubprojectId { get; set; }

    [Unicode(false)]
    public string Activity { get; set; }

    [Column("Start_time", TypeName = "datetime")]
    public DateTime? StartTime { get; set; }

    [Column("End_time", TypeName = "datetime")]
    public DateTime? EndTime { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Duration { get; set; }

    [Column("Updated_date", TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Column("Subprojectcategory_id")]
    public int? SubprojectcategoryId { get; set; }

    [Column("TaskList_id")]
    public int? TaskListId { get; set; }

    [Column("Active_Invoice")]
    public bool? ActiveInvoice { get; set; }

    [Column("Non_Billable")]
    public bool? NonBillable { get; set; }

    public bool? IsAdmin { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string WatcherAppTitle { get; set; }

    public int? UpdatedBy { get; set; }

    [Column("Activity_Updateddate", TypeName = "datetime")]
    public DateTime? ActivityUpdateddate { get; set; }

    [Column("Activity_Updatedby")]
    public int? ActivityUpdatedby { get; set; }
}
