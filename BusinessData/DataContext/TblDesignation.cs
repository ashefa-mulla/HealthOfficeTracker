using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Designation")]
public partial class TblDesignation
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; }

    [InverseProperty("Designation")]
    public virtual ICollection<TblEmployer> TblEmployers { get; set; } = new List<TblEmployer>();
}
