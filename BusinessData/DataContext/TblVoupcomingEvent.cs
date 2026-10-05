using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_VOUpcomingEvents")]
public partial class TblVoupcomingEvent
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EventDate { get; set; }

    [Required]
    [StringLength(150)]
    public string EventDetail { get; set; }

    public bool? Active { get; set; }
}
