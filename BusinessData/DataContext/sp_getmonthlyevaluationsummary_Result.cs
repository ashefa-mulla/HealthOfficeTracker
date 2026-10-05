using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getmonthlyevaluationsummary_Result
    {

        //public int EmployeeID { get; set; }
        //public string EmployeeName { get; set; }
        //public int QuestionID { get; set; }
        //public string QuestionText { get; set; }
        //public bool IsActive { get; set; }
        //public DateTime? DeactivatedAt { get; set; }

        //// WEEK 1
        //public int? Week1Id { get; set; }
        //public int? Week1Answer { get; set; }
        //public string Week1Comment { get; set; }
        //public int? Week1AdditionalPoints { get; set; }
        //public string Week1AdditionalComment { get; set; }

        //// WEEK 2
        //public int? Week2Id { get; set; }
        //public int? Week2Answer { get; set; }
        //public string Week2Comment { get; set; }
        //public int? Week2AdditionalPoints { get; set; }
        //public string Week2AdditionalComment { get; set; }

        //// WEEK 3
        //public int? Week3Id { get; set; }
        //public int? Week3Answer { get; set; }
        //public string Week3Comment { get; set; }
        //public int? Week3AdditionalPoints { get; set; }
        //public string Week3AdditionalComment { get; set; }

        //// WEEK 4
        //public int? Week4Id { get; set; }
        //public int? Week4Answer { get; set; }
        //public string Week4Comment { get; set; }
        //public int? Week4AdditionalPoints { get; set; }
        //public string Week4AdditionalComment { get; set; }
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public int QuestionID { get; set; }
        public string QuestionText { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DeactivatedAt { get; set; }

        // Lock info
        public int LockId { get; set; }     // NEW
        public bool IsLocked { get; set; }  // NEW: indicates if month is locked for this employee

        // WEEK 1
        public int? Week1Id { get; set; }
        public int? Week1Answer { get; set; }
        public string Week1Comment { get; set; }
        public int? Week1AdditionalPoints { get; set; }
        public string Week1AdditionalComment { get; set; }

        // WEEK 2
        public int? Week2Id { get; set; }
        public int? Week2Answer { get; set; }
        public string Week2Comment { get; set; }
        public int? Week2AdditionalPoints { get; set; }
        public string Week2AdditionalComment { get; set; }

        // WEEK 3
        public int? Week3Id { get; set; }
        public int? Week3Answer { get; set; }
        public string Week3Comment { get; set; }
        public int? Week3AdditionalPoints { get; set; }
        public string Week3AdditionalComment { get; set; }

        // WEEK 4
        public int? Week4Id { get; set; }
        public int? Week4Answer { get; set; }
        public string Week4Comment { get; set; }
        public int? Week4AdditionalPoints { get; set; }
        public string Week4AdditionalComment { get; set; }

    }
}
