using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class TrackerProjectModel
    {
        public int ID { get; set; }
        public int companyId { get; set; }
        public int branchId { get; set; }
        public string Project { get; set; }
        public string projectDescription { get; set; }
        public string vendorCompany { get; set; }
        public string personName { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public int cityId { get; set; }
        public int stateId { get; set; }
        public int countryId { get; set; }
        public string Zip { get; set; }
        public bool Active { get; set; }
    }
}
