using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_purchaseOrder_Details")]
    public partial class TblPurchaseOrderDetails
    {
        [Column("ID")]
        public int Id { get; set; }
        [Column("Company_ID")]
        public int CompanyId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime PurchaseOrderDate { get; set; }
        [Required]
        [StringLength(10)]
        public string Code { get; set; }
        [Column("Order_Type_ID")]
        public int OrderTypeId { get; set; }
        [Column("No_of_Qty", TypeName = "numeric(7, 2)")]
        public decimal NoOfQty { get; set; }
        [Column("title")]
        [StringLength(15)]
        public string Title { get; set; }
        [Column("Payment_Amount", TypeName = "numeric(7, 2)")]
        public decimal PaymentAmount { get; set; }
        [Column("Pyament_Type")]
        public int? PyamentType { get; set; }
        [Column("Check_CC_Detail")]
        [StringLength(50)]
        public string CheckCcDetail { get; set; }
        [Column("Bank_CC_Name")]
        [StringLength(50)]
        public string BankCcName { get; set; }
        [StringLength(300)]
        public string Remarks { get; set; }
        [Column("Order_By")]
        public int OrderBy { get; set; }
        [Column("Recurrent_Period", TypeName = "numeric(5, 2)")]
        public decimal? RecurrentPeriod { get; set; }
        [Column("Account_No")]
        [StringLength(30)]
        public string AccountNo { get; set; }
        [Column("Referance_Document")]
        [StringLength(300)]
        public string ReferanceDocument { get; set; }
        [Required]
        [Column("updated_by")]
        [StringLength(100)]
        public string UpdatedBy { get; set; }
        [Column("updated_date", TypeName = "datetime")]
        public DateTime UpdatedDate { get; set; }

        [ForeignKey("OrderTypeId")]
        [InverseProperty("TblPurchaseOrderDetails")]
        public virtual TblOrderType OrderType { get; set; }
    }
}
