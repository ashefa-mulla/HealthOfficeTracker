using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
   public class GetUserId
    {
        public int UserId { get; set; }
        public int UserType { get; set; }
        public string Pin { get; set; }
        public string ProfileImage { get; set; }
        public string UserRole { get; set; }
        public string Email { get; set; }
        public int EmployerId { get; set; }
        public string TimeZone { get; set; }
    }
}
