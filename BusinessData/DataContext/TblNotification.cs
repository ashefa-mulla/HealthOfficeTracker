using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Notification")]
public partial class TblNotification
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [StringLength(4000)]
    [Unicode(false)]
    public string Text { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ExecDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? OutDate { get; set; }

    public bool IsYesNo { get; set; }

    public bool IsRead { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime InsertedDate { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("TblNotifications")]
    public virtual TblUserMaster User { get; set; }
}
