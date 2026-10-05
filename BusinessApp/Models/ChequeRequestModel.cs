using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{

    public class ChequeRequestModel
    {
        public int bankId { get; set; }
        public int id { get; set; }
        public string currentUser { get; set; }
        public List<ChequeRequest> ChequeRequest { get; set; }
    }
    public class ChequeRequest
    {
        public int Id { get; set; }
        public int BankId { get; set; }        
        public DateTime RequestDate { get; set; }
        public string PayTo { get; set; }        
        public string Memo { get; set; }        
        public string Address { get; set; }
        public int CostCenterId { get; set; }
        public string PayMethod { get; set; }
        public Nullable<decimal> Amount { get; set; }
    }
}
