using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_BankDemo")]
public partial class TblBankDemo
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [StringLength(70)]
    [Unicode(false)]
    public string Name { get; set; }

    public int? Date { get; set; }
}
