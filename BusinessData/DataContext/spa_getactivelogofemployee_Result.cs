using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public partial class spa_getactivelogofemployee_Result
    {
        public int ID { get; set; }
        public string Fullname { get; set; }
        public string OExecDate { get; set; }
        public string Starttime { get; set; }
        public string OOutDate { get; set; }
        public string Endtime { get; set; }
        public string DURATION { get; set; }
        public Nullable<System.DateTime> Updated_date { get; set; }
        public string Project { get; set; }
        public string Subcategory { get; set; }
        public string subprojectcategory { get; set; }
        public string Activity { get; set; }
        public Nullable<int> SECONDVALUE { get; set; }
    }
}
