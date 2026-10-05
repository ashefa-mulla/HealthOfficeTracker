using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_UserMaster")]
public partial class TblUserMaster
{
    [Key]
    public int UserId { get; set; }

    public int UserType { get; set; }

    [Column("IdentityID")]
    [StringLength(128)]
    public string IdentityId { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string Pin { get; set; }

    public bool Active { get; set; }

    [Column("location_id")]
    public int? LocationId { get; set; }

    [Unicode(false)]
    public string ActivationCode { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<TblNotification> TblNotifications { get; set; } = new List<TblNotification>();

    [ForeignKey("UserType")]
    [InverseProperty("TblUserMasters")]
    public virtual TblUserType UserTypeNavigation { get; set; }
}
