using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BusinessData.DataContext
{
    public class get_trackerprojectfor_vc_Result
    {
        [Column("ID")]
        public int Id { get; set; }
        [Column("Company_id")]
        public int? CompanyId { get; set; }
        [Column("Branch_id")]
        public int? BranchId { get; set; }
        [StringLength(300)]
        public string Project { get; set; }
        [Column("Project_Description")]
        public string ProjectDescription { get; set; }
        [Column("vendor_company")]
        [StringLength(100)]
        public string VendorCompany { get; set; }
        [Column("Person_name")]
        [StringLength(100)]
        public string PersonName { get; set; }
        [Column("Address_Line1")]
        [StringLength(255)]
        public string AddressLine1 { get; set; }
        [Column("Address_Line2")]
        [StringLength(255)]
        public string AddressLine2 { get; set; }
        [Column("City_ID")]
        public int? CityId { get; set; }
        [Column("State_ID")]
        public int? StateId { get; set; }
        [Column("Country_ID")]
        public int? CountryId { get; set; }
        [StringLength(20)]
        public string Zip { get; set; }
        public bool? Active { get; set; }
    }
}
