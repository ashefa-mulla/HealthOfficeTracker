using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class TrackerSubProjectModel
    {
        public int Id { get; set; }        
        public int? CompanyId { get; set; }
        public int? BranchId { get; set; }
        public int? ProjectId { get; set; }
        public string Subcategory { get; set; }
        public string Description { get; set; }
        public decimal? Amount { get; set; }
        public bool? Active { get; set; }
        public bool? ProjectActive { get; set; }
        public int? ProjectCategory { get; set; }
        public DateTime? AssignDate { get; set; } // 3 column new added GJ 09-29 2023
        public DateTime? ETA { get; set; }
        public string ETATimebyproject { get; set; }
    }
}
