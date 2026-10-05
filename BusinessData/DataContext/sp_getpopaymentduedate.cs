using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
  public class sp_getpopaymentduedate
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string VendorName { get; set; }
        public string CategoryName { get; set; }
        public decimal PO_Amount { get; set; }
        public string PaymentDueDate { get; set; }
        public Nullable<int> Paytype { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string ProcessMethod { get; set; }
        public string NextPaymentDueDate { get; set; }
        public Nullable<int> MonthDiff { get; set; }
        public string FrequencyPayment { get; set; }
        public string Paybyname { get; set; }
    }
}
