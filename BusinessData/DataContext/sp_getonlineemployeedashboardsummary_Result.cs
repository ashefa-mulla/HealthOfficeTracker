using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.DataContext
{
    public class sp_getonlineemployeedashboardsummary_Result
    {
        public int ID { get; set; }
        public string User { get; set; }
        public int TotalTasks { get; set; }
        public int Pending { get; set; }
        public int Completed { get; set; }
        public decimal AssignedHours { get; set; }
        public decimal ActualHours { get; set; }
        public decimal Efficiency { get; set; }


        // NEW FIELDS
        public DateTime? OExecDate { get; set; }   // IN time
        public DateTime? OOutDate { get; set; }    // OUT time
        public string profileimage { get; set; }   // employee photo
    }
}
