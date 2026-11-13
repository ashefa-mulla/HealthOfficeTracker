using System.Collections.Generic;

namespace BusinessApp.Models
{
    public class UploadAttendanceResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int TotalRows { get; set; }
        public int InsertedCount { get; set; }
        public int UpdatedCount { get; set; }
        public int FailedCount { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}

