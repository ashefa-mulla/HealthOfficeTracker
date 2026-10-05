using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class BankMasterModel
    {
        public int ID { get; set; }
        public decimal AccountNo { get; set; }
        public string Name { get; set; }
        public string OpeningDate { get; set; }
        public Nullable<bool> Active { get; set; }
    }
}
