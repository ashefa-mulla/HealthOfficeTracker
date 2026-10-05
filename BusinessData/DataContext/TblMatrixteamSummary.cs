using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Matrixteam_Summary")]
public partial class TblMatrixteamSummary
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("User_id")]
    public int? UserId { get; set; }

    [Column("User_Name")]
    [StringLength(255)]
    [Unicode(false)]
    public string UserName { get; set; }

    [Column("-Tive")]
    public int? Tive { get; set; }

    [Column("+Tive")]
    public int? Tive1 { get; set; }

    [Column("Response_Date", TypeName = "datetime")]
    public DateTime? ResponseDate { get; set; }
}
