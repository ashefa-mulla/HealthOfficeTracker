using Azure.Core;
using BusinessData.DataContext;
using BusinessService.Custom.Agent;
using BusinessApp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using System.IO;
using System.Collections.Generic;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService agentService;
        private readonly ILogger<DeviceController> logger;
        private readonly IConfiguration configuration;

        private class LoggedUserDetail
        {
            public string? Device { get; set; }
            public string? Loggeduser { get; set; }
        }
        public DeviceController(IDeviceService _agentService, IConfiguration _configuration, ILogger<DeviceController> _logger)
        {
            agentService = _agentService;
            configuration = _configuration;
            logger = _logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistgerAgentModel request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (request.AgentId == Guid.Empty)
                {
                    return BadRequest("AgentId is required.");
                }

                if (string.IsNullOrWhiteSpace(request.MachineName))
                {
                    return BadRequest("MachineName is required.");
                }
                var existingData = await agentService.Get(request.AgentId);

                if (existingData == null)
                {
                    TblDevice data = new TblDevice();
                    data.MachineName = request.MachineName;
                    data.DeviceId = request.AgentId;
                    data.AgentVersion = request.AgentVersion;
                    data.WindowsUserName = request.WindowsUserName;
                    data.DisplayName = request.MachineName;
                    data.IsActive = true;
                    data.LastHeartbeatUtc = DateTime.UtcNow;
                    data.UpdatedAtUtc = DateTime.UtcNow;
                    data.CreatedAtUtc = DateTime.UtcNow;
                    await agentService.Inserttbl(data);

                    return Ok(new
                    {
                        Success = true,
                        IsNewAgent = true,
                        AgentId = data.DeviceId,
                        Message = "Agent registered successfully."
                    });
                }

                existingData.MachineName = request.MachineName;
                existingData.WindowsUserName = request.WindowsUserName;
                existingData.AgentVersion = request.AgentVersion;
                existingData.LastHeartbeatUtc = DateTime.UtcNow;
                existingData.UpdatedAtUtc = DateTime.UtcNow;
                await agentService.Updatetbl(existingData);
                return Ok(new
                {
                    Success = true,
                    IsNewAgent = false,
                    AgentId = request.AgentId,
                    Message = "Agent already exists and was updated."
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error inserting/updating Agent {AgentId}", request.AgentId);
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while processing Agent."
                });
            }
        }

        [HttpPost("heartbeat")]
        public async Task<IActionResult> Heartbeat([FromBody] HeartbeatAgentModel request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (request.AgentId == Guid.Empty)
                {
                    return BadRequest("AgentId is required.");
                }

                var existingAgent = await agentService.Get(request.AgentId);
                if (existingAgent != null)
                {
                    existingAgent.AgentVersion = request.AgentVersion;
                    existingAgent.LastHeartbeatUtc = DateTime.UtcNow;
                    existingAgent.UpdatedAtUtc = DateTime.UtcNow;
                    var result = await agentService.Updatetbl(existingAgent);
                    if (!result)
                    {
                        return BadRequest(new
                        {
                            Success = false,
                            AgentId = request.AgentId,
                            Message = "Heartbeat update failed."
                        });
                    }
                }
                return Ok(new
                {
                    Success = true,
                    AgentId = request.AgentId,
                    ServerTimeUtc = DateTime.UtcNow,
                    Message = "Heartbeat received."
                });

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing heartbeat for Agent {AgentId}", request.AgentId);
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while processing heartbeat."
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDeviceInfo()
        {
            string folderPath = configuration["Device:Winpath"] ?? "";
            //string fileName = "agent-id.txt";
            //string filePath = Path.Combine(folderPath, fileName);
            //string device = await System.IO.File.ReadAllTextAsync(filePath);
            string fileName = "device-data.json";
            string filePath = Path.Combine(folderPath, fileName);
            LoggedUserDetail json = new LoggedUserDetail();
            if (System.IO.File.Exists(filePath))
            {
                var data = await System.IO.File.ReadAllTextAsync(filePath);
                json = JsonSerializer.Deserialize<LoggedUserDetail>(data, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }

            return Ok(json);
        }

        [HttpPost("device-data")]
        public async Task<IActionResult> SaveDeviceData(string email)
        {
            string folderPath = configuration["Device:Winpath"] ?? "";
            string fileName = "agent-id.txt";
            string filePath = Path.Combine(folderPath, fileName);
            string device = await System.IO.File.ReadAllTextAsync(filePath);

            var data = new { device = device, loggeduser = email };
            fileName = "device-data.json";
            filePath = Path.Combine(folderPath, fileName);
            string json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });

            await System.IO.File.WriteAllTextAsync(filePath, json);
            return Ok(json);

        }

        [HttpGet("device-status")]
        public async Task<IActionResult> GetDeviceStatus(int empid)
        {
            var devicestatus = await agentService.GetClockedIn(empid) as List<sp_employee_clockedin>;

            return Ok(new
            {
                Success = true,
                ClockedIn = devicestatus[0].IsActive,
            });

        }
    }
}
