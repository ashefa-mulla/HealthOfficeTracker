using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_EvaluationSubmission")]
public partial class TblEvaluationSubmission
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

    public int EvalYear { get; set; }

    public byte EvalMonth { get; set; }

    public byte WeekOfMonth { get; set; }

    public int? AdditionalPoints { get; set; }

    [StringLength(1000)]
    public string AdditionalComment { get; set; }
}
