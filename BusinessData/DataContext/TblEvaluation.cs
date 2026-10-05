using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_Evaluation")]
    public partial class TblEvaluation
    {
        [Column("ID")]
        public int Id { get; set; }
        [Column("Employee_ID")]
        public int EmployeeId { get; set; }
        [Column("EvaluationQuestion_ID")]
        public int EvaluationQuestionId { get; set; }
        [Column("Evaluation_Employee_ID")]
        public int EvaluationEmployeeId { get; set; }
        public int Score { get; set; }
    }
}
