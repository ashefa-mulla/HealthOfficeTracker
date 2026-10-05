using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_EvaluationQuestions")]
public partial class TblEvaluationQuestion
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("EmployeeID")]
    public int EmployeeId { get; set; }

    [Required]
    public string QuestionText { get; set; }

    public bool IsActive { get; set; }

    public DateOnly CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DeactivatedAt { get; set; }
}
