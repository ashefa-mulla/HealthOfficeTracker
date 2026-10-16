using System;

namespace BusinessApp.Models
{
    public class UserTrackerTaskWithAmountItem
    {
        public int RowNo { get; set; }
        public int Id { get; set; }
        public string Person { get; set; }
        public string Project { get; set; }
        public string ProjectDescription { get; set; }
        public int SubprojectId { get; set; }
        public string Subcategory { get; set; } // Client
        public int DurationSec { get; set; }
        public string Duration { get; set; }
        public decimal Rate { get; set; }
        public string RateFormatted { get; set; }
        public decimal TotalAmount { get; set; }
        public string TotalAmountFormatted { get; set; }
    }
}
