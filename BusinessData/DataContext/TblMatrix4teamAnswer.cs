using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Matrix4team_Answer")]
public partial class TblMatrix4teamAnswer
{
    [Key]
    public int Id { get; set; }

    [Column("Q_Id")]
    public int? QId { get; set; }

    [Unicode(false)]
    public string Answer { get; set; }

    [Column("User_id")]
    public int? UserId { get; set; }

    [Column("Updated_date", TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Unicode(false)]
    public string CommentText { get; set; }
}
