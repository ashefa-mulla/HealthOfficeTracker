using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class TrackerSubProjectCategoryModel
    {
        public int ID { get; set; }
        public int companyId { get; set; }
        public int branchId { get; set; }
        public string subcategory { get; set; }
        public string description { get; set; }
        public Nullable<decimal> amount { get; set; }
        public int subprojectId { get; set; }
        public int projectId { get; set; }
        public bool active { get; set; }
        public bool projectActive { get; set; }
    }
}
