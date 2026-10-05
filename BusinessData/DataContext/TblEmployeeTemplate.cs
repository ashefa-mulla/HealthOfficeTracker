using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_Template")]
public partial class TblEmployeeTemplate
{
    [Key]
    public int Id { get; set; }

    [Column("Employee_id")]
    public int? EmployeeId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string Formname { get; set; }

    [Unicode(false)]
    public string Formjson { get; set; }

    public bool? Active { get; set; }

    [ForeignKey("EmployeeId")]
    [InverseProperty("TblEmployeeTemplates")]
    public virtual TblEmployer Employee { get; set; }

    [InverseProperty("Template")]
    public virtual ICollection<TblEmployeeMatrix> TblEmployeeMatrices { get; set; } = new List<TblEmployeeMatrix>();
}
