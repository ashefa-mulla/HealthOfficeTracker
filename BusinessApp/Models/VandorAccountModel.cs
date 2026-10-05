using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class VandorAccountModel
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal? Contact { get; set; }
        public string EmailId { get; set; }
        public Nullable<bool> Active { get; set; }
        public bool GetAllAccountCategory { get; set; }
        public string OtherInformation { get; set; }       
    }
}
