using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_getmonthlyevaluationsummaryaddedit_Result
    {
        public int? ID { get; set; }             // null = insert, not null = update
        public int EmployeeId { get; set; }
        public int QuestionId { get; set; }
        public bool Answer { get; set; }
        public string Comment { get; set; } = string.Empty;
        public int EvalYear { get; set; }
        public int EvalMonth { get; set; }
        public int WeekOfMonth { get; set; }
    }
}
