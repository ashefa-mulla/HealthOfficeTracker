using System;

namespace BusinessApp.Models
{
    public class MonthlyInvoiceSummaryItem
    {
        public int RowNo { get; set; }
        public string ProjectCategory { get; set; }
        public string Subcategory { get; set; }
        public decimal TotalNonBillableHours { get; set; }
        public decimal TotalHours { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
    }

    public class MonthlyInvoiceTaskItem
    {
        public DateTime? Start_time { get; set; }
        public string FormattedDate { get; set; }
        public string Activity { get; set; }
        public string Subcategory { get; set; }
        public string Subprojectcategory { get; set; }
        public string Person { get; set; }
        public decimal NonBillableHours { get; set; }
        public decimal Hours { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
    }

    public class MonthlyInvoicePersonSummaryItem
    {
        public string Person { get; set; }
        public decimal NonBillableHours { get; set; }
        public decimal Hours { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
    }
}
