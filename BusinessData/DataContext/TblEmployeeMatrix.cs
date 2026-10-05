using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_Matrix")]
public partial class TblEmployeeMatrix
{
    [Key]
    public int Id { get; set; }

    [Column("Evaluation_Date", TypeName = "datetime")]
    public DateTime? EvaluationDate { get; set; }

    [Column("Employee_id")]
    public int EmployeeId { get; set; }

    [Column("Template_id")]
    public int? TemplateId { get; set; }

    [Required]
    [Column("Column_name")]
    [StringLength(300)]
    [Unicode(false)]
    public string ColumnName { get; set; }

    [Required]
    [StringLength(1500)]
    [Unicode(false)]
    public string Question { get; set; }

    [Required]
    [Column("Column_type")]
    [StringLength(300)]
    [Unicode(false)]
    public string ColumnType { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string Answer { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string Comments { get; set; }

    public int? Maxrating { get; set; }

    public int? UserId { get; set; }

    [Column("Updated_dt", TypeName = "datetime")]
    public DateTime? UpdatedDt { get; set; }

    [ForeignKey("EmployeeId")]
    [InverseProperty("TblEmployeeMatrices")]
    public virtual TblEmployer Employee { get; set; }

    [ForeignKey("TemplateId")]
    [InverseProperty("TblEmployeeMatrices")]
    public virtual TblEmployeeTemplate Template { get; set; }
}
