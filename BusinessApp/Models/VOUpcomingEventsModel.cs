using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class VOUpcomingEventsModel
    {
        public int Id { get; set; }        
        public DateTime EventDate { get; set; }
        public string EventDetail { get; set; }
        public Nullable<bool> Active { get; set; }
    }
}
