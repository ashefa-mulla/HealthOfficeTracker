using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.DataContext
{
    public class sp_getemployeeworktimesummary_Results
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime ReportDate { get; set; }
        public DateTime? FirstActivityLocal { get; set; }
        public DateTime? LastActivityLocal { get; set; }
        public int TotalSeconds { get; set; }
        public decimal TotalHours { get; set; }
        public string TotalTime { get; set; } = string.Empty;   // hh:mm:ss
        public int MeetingSeconds { get; set; }
        public decimal MeetingHours { get; set; }
        public int ActivityCount { get; set; }
        public int ApplicationCount { get; set; }

        // new
        public int MeetingCount { get; set; }
        public string MeetingTime { get; set; } = string.Empty;
        public int AppSeconds { get; set; }
        public string AppTime { get; set; } = string.Empty;
        public int AppTimeInsideMeetingsSeconds { get; set; }
        public string AppTimeInsideMeetings { get; set; } = string.Empty;
        public int MeetingOnlySeconds { get; set; }
        public string MeetingOnlyTime { get; set; } = string.Empty;
        public int AppTimeOutsideMeetingsSeconds { get; set; }
        public string AppTimeOutsideMeetings { get; set; } = string.Empty;
    }
}
