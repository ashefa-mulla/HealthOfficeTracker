using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_EvaluationSubmission_copy1")]
    public partial class TblEvaluationSubmissionCopy1
    {
        [Column("ID")]
        public int Id { get; set; }
        [Column("EmployeeID")]
        public int EmployeeId { get; set; }
        [Column("QuestionID")]
        public int QuestionId { get; set; }
        public bool Answer { get; set; }
        [Column(TypeName = "date")]
        public DateTime? UpdatedDate { get; set; }
        public string Comment { get; set; }
    }
}
