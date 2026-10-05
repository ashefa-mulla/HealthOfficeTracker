using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_PunchDetailTodo")]
public partial class TblPunchDetailTodo
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Employee_ID")]
    public int EmployeeId { get; set; }

    [Column("shift_dt")]
    public DateOnly? ShiftDt { get; set; }

    [Unicode(false)]
    public string ToDoDetail { get; set; }

    public bool? EmailSent { get; set; }
}
