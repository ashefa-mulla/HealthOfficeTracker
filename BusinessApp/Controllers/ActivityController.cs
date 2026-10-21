using BusinessApp.Models;
using BusinessApp.Service.Activity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private readonly IActivitySyncService activitySyncService;
        private readonly ILogger<ActivityController> logger;

        public ActivityController(IActivitySyncService _activitySyncService, ILogger<ActivityController> _logger)
        {
            activitySyncService = _activitySyncService;
            logger = _logger;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> Sync([FromBody] ActivitySyncRequest request, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.AgentId == Guid.Empty)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "AgentId is required."
                });
            }

            if (request.ApplicationActivities == null)
            {
                request.ApplicationActivities = new List<ApplicationActivitySyncModel>();
            }

            if (request.IdleActivities == null)
            {
                request.IdleActivities = new List<IdleActivitySyncModel>();
            }

            try
            {
                logger.LogInformation(
                    "Activity sync request received. AgentId={AgentId}, ApplicationActivities={ApplicationCount}, IdleActivities={IdleCount}",
                    request.AgentId,
                    request.ApplicationActivities.Count,
                    request.IdleActivities.Count);

                var result = await activitySyncService.SyncAsync(
                    request,
                    cancellationToken);

                if (!result.Success)
                {
                    logger.LogWarning(
                        "Activity sync failed. AgentId={AgentId}, Received={Received}, Inserted={Inserted}, Duplicate={Duplicate}, Failed={Failed}",
                        result.AgentId,
                        result.RecordsReceived,
                        result.RecordsInserted,
                        result.RecordsDuplicate,
                        result.RecordsFailed);

                    return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        result);
                }

                logger.LogInformation(
                    "Activity sync completed. AgentId={AgentId}, Received={Received}, Inserted={Inserted}, Duplicate={Duplicate}, Failed={Failed}",
                    result.AgentId,
                    result.RecordsReceived,
                    result.RecordsInserted,
                    result.RecordsDuplicate,
                    result.RecordsFailed);

                return Ok(result);
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                logger.LogWarning(
                    "Activity sync cancelled. AgentId={AgentId}",
                    request.AgentId);

                return StatusCode(
                    StatusCodes.Status499ClientClosedRequest,
                    new
                    {
                        Success = false,
                        AgentId = request.AgentId,
                        Message = "Activity sync was cancelled."
                    });
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Unhandled error during activity sync. AgentId={AgentId}",
                    request.AgentId);

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        Success = false,
                        AgentId = request.AgentId,
                        Message = "An error occurred while synchronizing activities."
                    });
            }
        }
    }
}