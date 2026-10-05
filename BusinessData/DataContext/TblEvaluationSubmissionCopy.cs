using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_EvaluationSubmission_copy")]
public partial class TblEvaluationSubmissionCopy
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("EmployeeID")]
    public int EmployeeId { get; set; }

    [Column("QuestionID")]
    public int QuestionId { get; set; }

    public bool Answer { get; set; }

    public DateOnly? UpdatedDate { get; set; }

    [Unicode(false)]
    public string Comment { get; set; }
}
