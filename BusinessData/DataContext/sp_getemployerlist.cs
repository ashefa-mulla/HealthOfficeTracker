using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
   public  class sp_getemployerlist
    {
        public int ID { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string ProfileImage { get; set; }
        public int UserID { get; set; }
        public string Primary_contact { get; set; }
        public Nullable<bool> Active { get; set; }
        public string Primary_email { get; set; }
        public string Emergencycontactperson { get; set; }
        public string Emergencycontact { get; set; }
        public string StateName { get; set; }
        public string CityName { get; set; }
        public int Company_ID { get; set; }
    }
}
