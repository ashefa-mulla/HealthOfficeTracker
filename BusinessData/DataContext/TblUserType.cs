using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_UserType")]
public partial class TblUserType
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Type { get; set; }

    [InverseProperty("UserTypeNavigation")]
    public virtual ICollection<TblUserMaster> TblUserMasters { get; set; } = new List<TblUserMaster>();
}
