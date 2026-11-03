using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.DataContext
{
    public class sp_getemployeemeetingdetails_Results
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime ReportDate { get; set; }
        public string ApplicationName { get; set; } = string.Empty;
        public string? MeetingPlatform { get; set; }
        public DateTime MeetingStartLocal { get; set; }
        public DateTime MeetingEndLocal { get; set; }
        public int MeetingSeconds { get; set; }
        public string MeetingDuration { get; set; } = string.Empty;
        public int OnMeetingAppSeconds { get; set; }
        public string OnMeetingApp { get; set; } = string.Empty;
        public int OtherAppsSeconds { get; set; }
        public string OtherApps { get; set; } = string.Empty;
        public int NoActivitySeconds { get; set; }
        public string NoActivity { get; set; } = string.Empty;
        public string? AppsUsed { get; set; }
        public Guid? MeetingActivityId { get; set; }

    }
}
