using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessWeb.Data
{
    public class SendgridModel
    {
        public int delivered { get; set; }
        public int unsubscribes { get; set; }
        public int invalid_email { get; set; }
        public int bounces { get; set; }
        public int repeat_unsubscribes { get; set; }
        public int unique_clicks { get; set; }
        public int blocked { get; set; }
        public int spam_drop { get; set; }
        public int repeat_bounces { get; set; }
        public int repeat_spamreports { get; set; }
        public string date { get; set; }
        public int requests { get; set; }
        public int spamreports { get; set; }
        public int clicks { get; set; }
        public int opens { get; set; }
        public int unique_opens { get; set; }
    }
    public class SendGridCategoriesModel
    {
            public List<string> categories { get; set; }
      
    }
}
