using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace BusinessApp.Models
{

    public class EvaluationSubmissionModel
    {
        public int Id { get; set; }                // null or 0 = new record
        public int EmployeeId { get; set; }
        public int QuestionId { get; set; }
        public bool Answer { get; set; }
        public string UpdatedDate { get; set; }    // optional, UI only
        public string Comment { get; set; }
        public int EvalYear { get; set; }
        public int EvalMonth { get; set; }
        public int WeekOfMonth { get; set; }

        // ✅ NEW
        public int? AdditionalPoints { get; set; }
        public string AdditionalComment { get; set; }
    }

}
