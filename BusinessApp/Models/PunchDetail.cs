using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class PunchDetail
    {
        public int id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ShiftDt { get; set; }
        public int Branch { get; set; }
        public DateTime ShiftStartTime { get; set; }
        public DateTime? ShiftEndTime { get; set; }
        public decimal? ShiftHours { get; set; }
        public DateTime? BreakHours { get; set; }
        public decimal? TotalHours { get; set; }
        public int? EnterBy { get; set; }
        public string IpAddIn { get; set; }
        public string IpAddOut { get; set; }
        public string Location { get; set; }
        public string Zip { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string CaptureImg { get; set; }
        public int? UpdatedBy { get; set; }
        public bool? ManualUpdated { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int? EventId { get; set; }
        public string OutCaptureImg { get; set; }

        [Required(ErrorMessage = "PIN field is required")]
        public string PIN { get; set; }
        public string TimeZone { get; set; }
        public int Offset { get; set; }
        public Nullable<int> event_id { get; set; }
        public bool IsWebCam { get; set; }
        [Required(ErrorMessage = "User code field is required")]
        public int UserID { get; set; }

    }

    public class UserClockInModel
    {
        public int UserId { get; set; }
        public int EmployeeId { get; set; }
        public string UserName { get; set; }
        public string Pin { get; set; }
        public string IpAddress { get; set; }
        public string DeviceName { get; set; }
    }
}
