using System;

namespace BusinessApp.Data
{
    public class sp_getevaluationsubmissionsforedit_Results
    {

        public int ID { get; set; }
        public int EmployeeID { get; set; }
        public string Employeename { get; set; }
        public string QuestionText { get; set; }
        public int QuestionID { get; set; }
        public bool Answer { get; set; }
        public string Comment { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
