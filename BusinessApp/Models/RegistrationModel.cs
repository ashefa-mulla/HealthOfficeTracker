using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class RegistrationModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int UserType { get; set; }
        public string Credential { get; set; }
        public string NPINo { get; set; }
        public string Affiliation { get; set; }
        public string AffiliationOther { get; set; }
        public string Timezone { get; set; }
    }
}
