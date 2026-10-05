using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace BusinessApp.Models
{
    public class PurchaseOrderModel
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }

        public DateTime Podate { get; set; }

        public string Code { get; set; }

        public string PoType { get; set; }

        public int? CategoryId { get; set; }
   
        public int? VendorId { get; set; }

        public int? VendorAccountNo { get; set; }

        public decimal NoOfQty { get; set; }

        public decimal PoAmount { get; set; }

        public string Payby { get; set; }

        public string CheckCcDetail { get; set; }

        public string BankCcName { get; set; }
        public string Remarks { get; set; }

        public string Weblink { get; set; }
        public int? Paytype { get; set; }
        public bool? Active { get; set; }
        public int? OrderBy { get; set; }

        public int UpdatedBy { get; set; }

        public DateTime UpdatedDate { get; set; }

        public int? CostCentreId { get; set; }

        public DateTime? PaymentDueDate { get; set; }
        public int? ProcessMethod { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string OnlineAccess { get; set; }

        public string Why { get; set; }

        public string Accountable { get; set; }

        public string OnlineAccessUsername { get; set; }

        public string OnlineAccessPassword { get; set; }
        public string Workflow { get; set; }
        public decimal? LowerLimit { get; set; }
        public decimal? UpperLimit { get; set; }

        public decimal? PrincipalAmt { get; set; }

        public decimal? InterestAmt { get; set; }      
        public string SnailMail { get; set; }
        public string filesdoc { get; set; }
        public ICollection<POReferanceDocument> porefdoc { get; set; }
    }
}
