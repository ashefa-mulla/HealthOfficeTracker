using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class TaskList
    {
        //public int ID { get; set; }
        //public int PointPerson { get; set; }
        //public int SecondPerson { get; set; }
        //public int AccountablePerson { get; set; }
        //public int Project { get; set; }
        //public int Subproject { get; set; }
        //public int SubProjectCategory { get; set; }
        //public string Task { get; set; }
        //public int Companyid { get; set; }
        //public int Branchid { get; set; }
        //public string Completed { get; set; }
        //public DateTime ETA { get; set; }
        //public DateTime AssignDate { get; set; }
        //public int etaTime { get; set; }
        //public int actualTime { get; set; }
        //public Nullable<System.DateTime> Starttime { get; set; }
        //public Nullable<System.DateTime> Endtime { get; set; }
        //public string Duration { get; set; }
        //public Nullable<System.DateTime> Updateddate { get; set; }
        //public string Subject { get; set; }
        //public string button { get; set; }
        //public string StatusPercentage { get; set; }
        //public string etaHH { get; set; }
        //public string etaMM { get; set; }
        //public int ActualTime { get; set; }
        //public DateTime CreatedTime { get; set; }
        //public DateTime UpdatedTime { get; set; }

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
        [StringLength(300)]
        public string Subject { get; set; }

        [StringLength(2000)]
        public string Task { get; set; }
        [StringLength(50)]
        public string Completed { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AssignDate { get; set; }

        [Column("ETA", TypeName = "datetime")]
        public DateTime? Eta { get; set; }

        [Column("ETA_Time")]
        public int EtaTime { get; set; }
        [Column("Actual_Time")]
        public int ActualTime { get; set; }

        [Column("Created_Time", TypeName = "datetime")]
        public DateTime? CreatedTime { get; set; }

        [Column("Updated_Time", TypeName = "datetime")]
        public DateTime? UpdatedTime { get; set; }
        public string etaHH { get; set; }
        public string etaMM { get; set; }
        public bool IsRecurrent { get; set; }



    }
}
