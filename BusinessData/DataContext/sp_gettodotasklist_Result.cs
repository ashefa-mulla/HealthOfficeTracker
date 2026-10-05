using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_gettodotasklist_Result
    {
        public int ID { get; set; }
        public int Point_Person { get; set; }
        public int Second_Person { get; set; }
        public int Accountable_Person { get; set; }
        public int Project { get; set; }
        public int Subproject { get; set; }
        public int SubProject_Category { get; set; }
        public string Subject { get; set; }
        public string Task { get; set; }
        public string Completed { get; set; }
        public Nullable<System.DateTime> AssignDate { get; set; }
        public Nullable<System.DateTime> ETA { get; set; }
        public string ETA_Time { get; set; }

    }
}
