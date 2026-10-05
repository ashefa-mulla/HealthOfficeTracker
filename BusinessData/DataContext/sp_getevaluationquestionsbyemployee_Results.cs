using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getevaluationquestionsbyemployee_Results
    {
        public int ID { get; set; }
        public int EmployeeID { get; set; }
        public string QuestionText { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
