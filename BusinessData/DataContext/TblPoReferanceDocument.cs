using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_PO_ReferanceDocument")]
public partial class TblPoReferanceDocument
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("POID")]
    public int? Poid { get; set; }

    [Column("Referance_Document")]
    [StringLength(300)]
    [Unicode(false)]
    public string ReferanceDocument { get; set; }
}
