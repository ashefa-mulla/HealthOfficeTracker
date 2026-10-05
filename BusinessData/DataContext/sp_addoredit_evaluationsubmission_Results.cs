using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class MonthlyEvaluationSubmissionDto
    {
        public int? ID { get; set; }
        public int EmployeeID { get; set; }
        public int QuestionID { get; set; }
        public bool Answer { get; set; }
        public string Comment { get; set; }
        public int EvalYear { get; set; }
        public int EvalMonth { get; set; }
        public int WeekOfMonth { get; set; }
    }

}
