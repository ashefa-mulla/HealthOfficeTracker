using System;

namespace BusinessApp.Models
{
    public class UserLogReportItem
    {
        public DateTime shift_dt { get; set; }
        public int? DayLoginCount { get; set; }
        public DateTime? shift_start_time { get; set; }
        public DateTime? shift_end_time { get; set; }
        public string EmployeeName { get; set; }
        public string ToDoDetail { get; set; }
        public int? SECONDVALUE { get; set; }
        public string Duration { get; set; }
        public string ShiftDateDisplay { get; set; }
        public string LogInDisplay { get; set; }
        public string LogOutDisplay { get; set; }
    }
}
