using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_ClientProjectAccess")]
public partial class TblClientProjectAccess
{
    [Key]
    public int Id { get; set; }

    [Column("Project_Id")]
    public int ProjectId { get; set; }

    [Column("Admin_Id")]
    public int AdminId { get; set; }
}
