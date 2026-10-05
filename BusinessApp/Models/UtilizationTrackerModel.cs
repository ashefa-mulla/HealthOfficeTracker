using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class UtilizationTrackerModel
    {
        public int ID { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Employeeid { get; set; }
        public int ProjectId { get; set; }
        public int SubProjectId { get; set; }
        public string Activity { get; set; }
        public Nullable<System.DateTime> StartTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public string Duration { get; set; }
        public Nullable<System.DateTime> Updateddate { get; set; }
        public string button { get; set; }
        public int SubProjectCategoryId { get; set; }
        public Nullable<int> TaskListid { get; set; }
        public bool ActiveInvoice { get; set; }
        public int CloneID { get; set; }
        public bool? IsAdmin { get; set; }
        public bool? NonBillable { get; set; }       
        public string WatcherAppTitle { get; set; }
        public int? UpdatedBy { get; set; }

        [Column("Activity_Updateddate", TypeName = "datetime")]
        public DateTime? ActivityUpdateddate { get; set; }
        [Column("Activity_Updatedby")]
        public int? ActivityUpdatedby { get; set; }
    }
}
