using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class GetTrackerTaskbyMonthbyGJ_Result
    {
        public int ID { get; set; }
        public string Company_Name { get; set; }
        public string Branch_name { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string Person { get; set; }
        public string Project { get; set; }
        public string Project_Description { get; set; }
        public Nullable<bool> ProjectActive { get; set; }
        public int subprojectid { get; set; }
        public string Subcategory { get; set; }
        public string Subprojectcategory { get; set; }
        public string Activity { get; set; }
        public Nullable<System.DateTime> Start_time { get; set; }
        public Nullable<System.DateTime> End_time { get; set; }
        public string Duration { get; set; }
        public Nullable<decimal> nonbillablehoursvalue { get; set; }
        public decimal amount { get; set; }
        public Nullable<decimal> hoursvalue { get; set; }
        public Nullable<decimal> TotalAmount { get; set; }
    }
}
