using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Keyless]
[Table("Tbl_Matrix4team")]
public partial class TblMatrix4team
{
    public int? Id { get; set; }

    [StringLength(255)]
    public string Questions { get; set; }

    public bool? Active { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string Type { get; set; }
}
