using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_EvaluationQuestions")]
    public partial class TblEvaluationQuestions
    {
        [Column("ID")]
        public int Id { get; set; }
        [Column("EmployeeID")]
        public int EmployeeId { get; set; }
        [Required]
        public string QuestionText { get; set; }
        [Required]
        public bool? IsActive { get; set; }
        [Column(TypeName = "date")]
        public DateTime CreatedAt { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeactivatedAt { get; set; }
    }
}
