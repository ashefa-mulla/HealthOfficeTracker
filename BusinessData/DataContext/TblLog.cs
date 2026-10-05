using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Keyless]
[Table("Tbl_Log")]
public partial class TblLog
{
    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string Thread { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Level { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string Logger { get; set; }

    [StringLength(4000)]
    [Unicode(false)]
    public string Message { get; set; }

    [StringLength(2000)]
    [Unicode(false)]
    public string Exception { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string MethodName { get; set; }

    [StringLength(4000)]
    [Unicode(false)]
    public string StackTrace { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string IpAddress { get; set; }
}
