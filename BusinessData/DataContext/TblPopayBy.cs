using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_POPayBy")]
public partial class TblPopayBy
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string PayBy { get; set; }

    public bool? Active { get; set; }
}
