using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_Snapshots")]
    public partial class TblSnapshots
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("emp_id")]
        public int? EmpId { get; set; }
        [Column("apptitle")]
        [StringLength(500)]
        public string Apptitle { get; set; }
        [Column("applicationlog_id")]
        public int? ApplicationlogId { get; set; }
        [Column("start_time", TypeName = "datetime")]
        public DateTime? StartTime { get; set; }
        [Column("end_time", TypeName = "datetime")]
        public DateTime? EndTime { get; set; }
        [Column("totalprocesstime")]
        public int? Totalprocesstime { get; set; }
        [Column("usedprocesstime")]
        public int? Usedprocesstime { get; set; }
        [Column("votrackerid")]
        public int? Votrackerid { get; set; }
        [Column("projectid")]
        public int? Projectid { get; set; }
        [Column("subprojectid")]
        public int? Subprojectid { get; set; }
        [Column("subprojectbranchid")]
        public int? Subprojectbranchid { get; set; }
    }
}
