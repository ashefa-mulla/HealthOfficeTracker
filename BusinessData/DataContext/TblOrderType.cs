using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Order_Type")]
public partial class TblOrderType
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Company_ID")]
    public int CompanyId { get; set; }

    [Required]
    [Column("Order_Type_name")]
    [StringLength(50)]
    [Unicode(false)]
    public string OrderTypeName { get; set; }

    [Required]
    [Column("updated_by")]
    [StringLength(100)]
    [Unicode(false)]
    public string UpdatedBy { get; set; }

    [Column("updated_date", TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    [ForeignKey("CompanyId")]
    [InverseProperty("TblOrderTypes")]
    public virtual TblCompany Company { get; set; }

    [InverseProperty("OrderType")]
    public virtual ICollection<TblPurchaseOrderDetail> TblPurchaseOrderDetails { get; set; } = new List<TblPurchaseOrderDetail>();
}
