using System;

namespace BusinessApp.Models
{
    public class RegistgerAgentModel
    {
        public Guid AgentId { get; set; }
        public string MachineName { get; set; } = string.Empty;
        public string? WindowsUserName { get; set; }
        public string? AgentVersion { get; set; }
    }

    public class HeartbeatAgentModel
    {
        public Guid AgentId { get; set; }
        public string? AgentVersion { get; set; }
    }
}
