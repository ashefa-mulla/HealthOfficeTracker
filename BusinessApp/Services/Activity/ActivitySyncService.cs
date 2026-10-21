using BusinessApp.Models;
using BusinessData.DataContext;
using BusinessService.Custom.Agent;
using BusinessService.Custom.ApplicationActivity;
using BusinessService.Custom.IdleActivity;
using BusinessService.Custom.SyncLog;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;


namespace BusinessApp.Service.Activity
{
    public class ActivitySyncService : IActivitySyncService
    {
        private readonly IApplicationActivityService _applicationActivityService;
        private readonly IIdleActivityService _idleActivityService;
        private readonly ISyncLogService _syncLogService;
        private readonly ILogger<ActivitySyncService> _logger;
        private readonly IDeviceService _agentService;
        public ActivitySyncService(IApplicationActivityService applicationActivityService,
            IIdleActivityService idleActivityService, ISyncLogService syncLogService,
            ILogger<ActivitySyncService> logger, IDeviceService agentService)
        {
            _applicationActivityService = applicationActivityService;
            _idleActivityService = idleActivityService;
            _syncLogService = syncLogService;
            _agentService = agentService;
            _logger = logger;
        }

        public async Task<ActivitySyncResponse> SyncAsync(ActivitySyncRequest request,
            CancellationToken cancellationToken = default)
        {
            var syncStartedUtc = DateTime.UtcNow;

            var recordsReceived = (request.ApplicationActivities?.Count ?? 0) +
                (request.IdleActivities?.Count ?? 0);

            var recordsInserted = 0;
            var recordsDuplicate = 0;
            var recordsFailed = 0;
            var synchronizedActivityIds = new List<Guid>();
            var errorMessages = new List<string>();

            _logger.LogInformation("Starting activity sync. AgentId={AgentId}, RecordsReceived={RecordsReceived}",
                request.AgentId, recordsReceived);

            var syncLog = new TblSyncLog
            {
                DeviceId = request.AgentId,
                EmployeeId = request.UserId,
                SyncStartedUtc = syncStartedUtc,
                RecordsReceived = recordsReceived,
                RecordsInserted = 0,
                RecordsDuplicate = 0,
                RecordsFailed = 0,
                IsSuccessful = false,
                CreatedAtUtc = syncStartedUtc
            };

            try
            {
                // ---------------------------------------------------------
                // APPLICATION ACTIVITIES
                // ---------------------------------------------------------

                if (request.ApplicationActivities != null)
                {
                    foreach (var item in request.ApplicationActivities)
                    {
                        cancellationToken.ThrowIfCancellationRequested();

                        try
                        {
                            if (item.ActivityId == Guid.Empty)
                            {
                                recordsFailed++;

                                errorMessages.Add("Application activity contains an empty ActivityId.");

                                continue;
                            }

                            var existing = await _applicationActivityService.Get(item.ActivityId, request.AgentId);

                            if (existing != null)
                            {
                                recordsDuplicate++;

                                synchronizedActivityIds.Add(
                                    item.ActivityId);

                                _logger.LogDebug(
                                    "Duplicate application activity. ActivityId={ActivityId}, AgentId={AgentId}",
                                    item.ActivityId,
                                    request.AgentId);

                                continue;
                            }

                            var now = DateTime.UtcNow;
                            var activity = new TblApplicationActivity
                            {
                                ActivityId = item.ActivityId,
                                DeviceId = request.AgentId,
                                EmployeeId = request.UserId,
                                StartTimeUtc = item.StartTimeUtc,
                                EndTimeUtc = item.EndTimeUtc,
                                ApplicationName = item.ApplicationName?.Trim() ?? string.Empty,
                                ProcessName = item.ProcessName?.Trim() ?? string.Empty,
                                WindowTitle = string.IsNullOrWhiteSpace(item.WindowTitle) ? null : item.WindowTitle.Trim()[..Math.Min(item.WindowTitle.Trim().Length, 1000)],
                                DurationSeconds = item.DurationSeconds,
                                ReceivedAtUtc = now,
                                CreatedAtUtc = now,
                                MeetingPlatform = item.MeetingPlatform,
                                IsInMeeting = item.IsInMeeting,
                                MeetingActivityId = item.MeetingActivityId,
                            };

                            await _applicationActivityService.Inserttbl(activity);

                            recordsInserted++;
                            synchronizedActivityIds.Add(item.ActivityId);

                            _logger.LogDebug("Application activity inserted. ActivityId={ActivityId}, AgentId={AgentId}",
                                item.ActivityId, request.AgentId);
                        }
                        catch (Exception ex)
                        {
                            recordsFailed++;

                            var message = $"Application ActivityId {item.ActivityId}: {ex.Message}";

                            errorMessages.Add(message);

                            _logger.LogError(ex, "Error processing application activity. ActivityId={ActivityId}, AgentId={AgentId}",
                                item.ActivityId, request.AgentId);
                        }
                    }
                }

                // ---------------------------------------------------------
                // IDLE ACTIVITIES
                // ---------------------------------------------------------

                if (request.IdleActivities != null)
                {
                    foreach (var item in request.IdleActivities)
                    {
                        cancellationToken.ThrowIfCancellationRequested();

                        try
                        {
                            if (item.ActivityId == Guid.Empty)
                            {
                                recordsFailed++;
                                errorMessages.Add("Idle activity contains an empty ActivityId.");
                                continue;
                            }

                            var existing = await _idleActivityService.Get(item.ActivityId, request.AgentId);

                            if (existing != null)
                            {
                                recordsDuplicate++;

                                synchronizedActivityIds.Add(
                                    item.ActivityId);

                                _logger.LogDebug("Duplicate idle activity. ActivityId={ActivityId}, AgentId={AgentId}",
                                    item.ActivityId, request.AgentId);
                                continue;
                            }

                            var now = DateTime.UtcNow;
                            var activity = new TblIdleActivity
                            {
                                ActivityId = item.ActivityId,
                                DeviceId = request.AgentId,
                                EmployeeId = request.UserId,
                                StartTimeUtc = item.StartTimeUtc,
                                EndTimeUtc = item.EndTimeUtc,
                                DurationSeconds = item.DurationSeconds,
                                ReceivedAtUtc = now,
                                CreatedAtUtc = now
                            };

                            await _idleActivityService.Inserttbl(activity);

                            recordsInserted++;
                            synchronizedActivityIds.Add(item.ActivityId);

                            _logger.LogDebug("Idle activity inserted. ActivityId={ActivityId}, AgentId={AgentId}",
                                item.ActivityId, request.AgentId);
                        }
                        catch (Exception ex)
                        {
                            recordsFailed++;
                            var message = $"Idle ActivityId {item.ActivityId}: {ex.Message}";
                            errorMessages.Add(message);
                            _logger.LogError(ex, "Error processing idle activity. ActivityId={ActivityId}, AgentId={AgentId}",
                                item.ActivityId, request.AgentId);
                        }
                    }
                }

                // ---------------------------------------------------------
                // COMPLETE SYNC LOG
                // ---------------------------------------------------------

                var syncCompletedUtc = DateTime.UtcNow;
                syncLog.SyncCompletedUtc = syncCompletedUtc;
                syncLog.RecordsReceived = recordsReceived;
                syncLog.RecordsInserted = recordsInserted;
                syncLog.RecordsDuplicate = recordsDuplicate;
                syncLog.RecordsFailed = recordsFailed;

                syncLog.IsSuccessful = recordsFailed == 0;

                if (errorMessages.Count > 0)
                {
                    syncLog.ErrorMessage = string.Join(Environment.NewLine, errorMessages)
                            .Length > 2000 ? string.Join(Environment.NewLine, errorMessages).Substring(0, 2000)
                            : string.Join(Environment.NewLine, errorMessages);
                }

                await _syncLogService.Inserttbl(syncLog);

                _logger.LogInformation("Activity sync completed. AgentId={AgentId}, Received={Received}, Inserted={Inserted}, Duplicate={Duplicate}, Failed={Failed}",
                    request.AgentId, recordsReceived, recordsInserted, recordsDuplicate, recordsFailed);

                //=======================
                //Agent LastSyncUtc update
                //=======================
                var agentdata = await _agentService.Get(request.AgentId);

                if (agentdata != null)
                {
                    agentdata.LastSyncUtc = DateTime.UtcNow;
                    await _agentService.Updatetbl(agentdata);
                }

                return new ActivitySyncResponse
                {
                    Success = recordsFailed == 0,
                    AgentId = request.AgentId,
                    UserId = request.UserId,
                    RecordsReceived = recordsReceived,
                    RecordsInserted = recordsInserted,
                    RecordsDuplicate = recordsDuplicate,
                    RecordsFailed = recordsFailed,
                    Message = recordsFailed == 0
                        ? "Activities synchronized successfully."
                        : "Activities synchronized with some failures.",
                    SynchronizedActivityIds = synchronizedActivityIds
                };
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                _logger.LogWarning("Activity sync cancelled. AgentId={AgentId}", request.AgentId);

                syncLog.SyncCompletedUtc = DateTime.UtcNow;
                syncLog.RecordsReceived = recordsReceived;
                syncLog.RecordsInserted = recordsInserted;
                syncLog.RecordsDuplicate = recordsDuplicate;
                syncLog.RecordsFailed = recordsFailed;
                syncLog.IsSuccessful = false;
                syncLog.ErrorMessage = "Activity sync was cancelled.";

                try
                {
                    await _syncLogService.Inserttbl(syncLog);
                }
                catch (Exception logEx)
                {
                    _logger.LogError(logEx, "Unable to save cancelled sync log. AgentId={AgentId}",
                        request.AgentId);
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Activity sync failed. AgentId={AgentId}", request.AgentId);
                syncLog.SyncCompletedUtc = DateTime.UtcNow;
                syncLog.RecordsReceived = recordsReceived;
                syncLog.RecordsInserted = recordsInserted;
                syncLog.RecordsDuplicate = recordsDuplicate;
                syncLog.RecordsFailed = recordsFailed;
                syncLog.IsSuccessful = false;
                syncLog.ErrorMessage = ex.Message.Length > 2000 ? ex.Message.Substring(0, 2000) : ex.Message;

                try
                {
                    await _syncLogService.Inserttbl(syncLog);
                }
                catch (Exception logEx)
                {
                    _logger.LogError(logEx, "Unable to save failed sync log. AgentId={AgentId}", request.AgentId);
                }

                return new ActivitySyncResponse
                {
                    Success = false,
                    AgentId = request.AgentId,
                    RecordsReceived = recordsReceived,
                    RecordsInserted = recordsInserted,
                    RecordsDuplicate = recordsDuplicate,
                    RecordsFailed = recordsFailed,
                    Message = "Activity synchronization failed."
                };
            }
        }
    }
}