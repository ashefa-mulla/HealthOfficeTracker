using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_PODetails")]
public partial class TblPodetail
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Company_ID")]
    public int CompanyId { get; set; }

    [Column("PODate", TypeName = "datetime")]
    public DateTime Podate { get; set; }

    [Required]
    [StringLength(10)]
    [Unicode(false)]
    public string Code { get; set; }

    [Column("PO_Type")]
    [StringLength(10)]
    [Unicode(false)]
    public string PoType { get; set; }

    [Column("Category_ID")]
    public int? CategoryId { get; set; }

    [Column("Vendor_ID")]
    public int? VendorId { get; set; }

    [Column("Vendor_Account_No")]
    public int? VendorAccountNo { get; set; }

    [Column("No_of_Qty", TypeName = "numeric(5, 2)")]
    public decimal NoOfQty { get; set; }

    [Column("PO_Amount", TypeName = "numeric(9, 2)")]
    public decimal PoAmount { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string Payby { get; set; }

    [Column("Check_CC_Detail")]
    [StringLength(50)]
    [Unicode(false)]
    public string CheckCcDetail { get; set; }

    [Column("Bank_CC_Name")]
    [StringLength(50)]
    [Unicode(false)]
    public string BankCcName { get; set; }

    [Unicode(false)]
    public string Remarks { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Weblink { get; set; }

    public int? Paytype { get; set; }

    public bool? Active { get; set; }

    [Column("Order_By")]
    public int? OrderBy { get; set; }

    [Column("updated_by")]
    public int UpdatedBy { get; set; }

    [Column("updated_date", TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    [Column("CostCentreID")]
    public int? CostCentreId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PaymentDueDate { get; set; }

    public int? ProcessMethod { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    [Column("Online_Access")]
    [Unicode(false)]
    public string OnlineAccess { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string Why { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string Accountable { get; set; }

    [Column("Online_Access_Username")]
    [StringLength(100)]
    [Unicode(false)]
    public string OnlineAccessUsername { get; set; }

    [Column("Online_Access_Password")]
    [StringLength(100)]
    [Unicode(false)]
    public string OnlineAccessPassword { get; set; }

    [Unicode(false)]
    public string Workflow { get; set; }

    [Column(TypeName = "numeric(9, 2)")]
    public decimal? LowerLimit { get; set; }

    [Column(TypeName = "numeric(9, 2)")]
    public decimal? UpperLimit { get; set; }

    [Column(TypeName = "numeric(9, 2)")]
    public decimal? PrincipalAmt { get; set; }

    [Column(TypeName = "numeric(9, 2)")]
    public decimal? InterestAmt { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string SnailMail { get; set; }
}
