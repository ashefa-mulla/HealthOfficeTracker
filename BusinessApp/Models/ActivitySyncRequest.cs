using System;
using System.Collections.Generic;

namespace BusinessApp.Models
{
    public class ActivitySyncRequest
    {
        public Guid AgentId { get; set; }
        public int UserId { get; set; }
        public List<ApplicationActivitySyncModel> ApplicationActivities { get; set; } = new();
        public List<IdleActivitySyncModel> IdleActivities { get; set; } = new();
    }

    public class ApplicationActivitySyncModel
    {
        public Guid ActivityId { get; set; }
        public DateTime StartTimeUtc { get; set; }
        public DateTime EndTimeUtc { get; set; }
        public string ApplicationName { get; set; } = string.Empty;
        public string ProcessName { get; set; } = string.Empty;
        public string? WindowTitle { get; set; }
        public int DurationSeconds { get; set; }
        public string? MeetingPlatform { get; set; }
        public bool IsInMeeting { get; set; }
        public Guid? MeetingActivityId { get; set; }
    }

    public class IdleActivitySyncModel
    {
        public Guid ActivityId { get; set; }
        public DateTime StartTimeUtc { get; set; }
        public DateTime EndTimeUtc { get; set; }
        public int DurationSeconds { get; set; }
    }

    public class ActivitySyncResponse
    {
        public bool Success { get; set; }
        public Guid AgentId { get; set; }
        public int UserId { get; set; }

        public int RecordsReceived { get; set; }
        public int RecordsInserted { get; set; }
        public int RecordsDuplicate { get; set; }
        public int RecordsFailed { get; set; }
        public string? Message { get; set; }
        public List<Guid> SynchronizedActivityIds { get; set; } = new();
    }
}
