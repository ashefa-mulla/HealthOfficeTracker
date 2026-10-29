using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.DataContext
{
    public class sp_getemployeeactivitydetails_Results
    {
        public long Id { get; set; }                     // bigint
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime ReportDate { get; set; }
        public DateTime StartTimeLocal { get; set; }
        public DateTime EndTimeLocal { get; set; }
        public string ApplicationName { get; set; } = string.Empty;
        public string ProcessName { get; set; } = string.Empty;
        public string? WindowTitle { get; set; }
        public int DurationSeconds { get; set; }
        public bool IsInMeeting { get; set; }            // bit (ISNULL → never null)
        public string? MeetingPlatform { get; set; }
        public Guid? MeetingActivityId { get; set; }     // uniqueidentifier, nullable
        public Guid DeviceId { get; set; }               // uniqueidentifier
        public Guid ActivityId { get; set; }             // uniqueidentifier
        public DateTime StartTimeUtc { get; set; }
        public DateTime EndTimeUtc { get; set; }
    }
}
