using AutoMapper;
using BusinessApp.Data;
using BusinessApp.Settings;
using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Custom.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using BusinessService.Custom.Notification;
using BusinessApp.Models;
using Microsoft.AspNetCore.Cors;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class DashboradController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly ILogger<EmployeeController> Logger;
        private readonly INotificationService notificationService;
        private readonly IUserService userServices;
        private readonly ApplicationSettings appSettings;
        private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager;


        public DashboradController(IMapper _Mapper, ILogger<EmployeeController> _Logger, INotificationService _notificationService,
            IUserService _userServices, IOptions<ApplicationSettings> _appSettings, Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _userManager)
        {
            Mapper = _Mapper;
            Logger = _Logger;
            notificationService = _notificationService;
            userServices = _userServices;
            userManager = _userManager;
            appSettings = _appSettings.Value;
        }

        [HttpGet("GetNotification")]
        public async Task<ActionResult<GetUserLogNotification_Result>> GetNotification()
        {
            var result = await notificationService.GetTodayNotification();

            if (result != null)
                return Ok(result);
            else
                return NotFound();
        }

        [HttpGet("GetTodayLeaveList")]
        public async Task<ActionResult<GetTodayLeaveList_Result>> GetTodayLeaveList()
        {
            var result = await notificationService.GetTodayLeaveList();
            if (result != null)
                return Ok(result);
            else
                return NotFound();
        }
        [HttpGet("clientgraphreport")]
        public async Task<ActionResult<getclientgraphreport_Result>> GetGraphReport(string stdt, string enddt)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await notificationService.GetGraphReport(stdt1, enddt2);

                if (result != null && result.Any())
                    return Ok(result);
                else
                    return Ok(null);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        //#new get name of emloyee for team cmpnt 05-20 2025 GJ
        [HttpGet("GetTaem")]
        public async Task<ActionResult<GeTeamList_Results>> GetTeamMambers()
        {
            var result = await notificationService.GetTeamMambers();

            if (result != null)
                return Ok(result);
            else
                return NotFound();
        }


        [HttpGet("employeetaskdummaryforyesterday")]
        public async Task<ActionResult<IEnumerable<sp_GetEmployeeTaskSummary_Yesterday_Results>>> GetEmployeeTaskSummaryForYesterday()
        {
            try
            {
                var result = await notificationService.GetEmployeeTaskSummaryForYesterday();

                if (result != null && result.Any())
                    return Ok(result);
                else
                    return NotFound("No data found.");
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEmployeeTaskSummaryForYesterday: {ex}");

                return StatusCode(500, new
                {
                    message = "An error occurred while fetching the employee task summary.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("GetCurrentMonthOutstanding")]
        public async Task<ActionResult<sp_getcurrentmonthOutstandingByAdmin_Results>> GetCurrentMonthOutstanding(int adminId)
        {
            try
            {
                var result = await notificationService.GetCurrentMonthOutstanding(adminId);

                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetCurrentMonthOutstanding: {ex.Message}", ex);
                return BadRequest("An error occurred while fetching the outstanding data.");
            }
        }

        [HttpGet("clientprojectsummerybyperson")]
        public async Task<ActionResult<IEnumerable<sp_getadminprojectsummaryfordashboard_Results>>> GetAdminProjectReport(
        int adminId, DateTime start, DateTime end)
        {
            try
            {
                var result = await notificationService.GetAdminProjectReportByAdminAsync(adminId, start, end);

                if (result != null && result.Any())
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAdminProjectReport: {ex}");
                return BadRequest($"ERROR: {ex.Message}");
            }


        }
        //feedback from per% report
        [HttpGet("GetMentionPointsSummary")]
        public async Task<ActionResult<IEnumerable<getfeedbackformmentionpointssummary>>> GetMentionPointsSummary([FromQuery]  DateTime startDate, [FromQuery]  DateTime endDate)
        {
            try
            {
                var result = await notificationService.GetMentionPointsSummaryAsync(startDate, endDate);

                if (result != null && result.Any())
                    return Ok(result);
                else
                    return NotFound("No mention points summary data found for the given dates.");
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetMentionPointsSummary: {ex.Message}", ex);
                return BadRequest("An error occurred while fetching the mention points summary.");
            }
        }


        // Daily Duration Report - below 3 hours
        //[HttpGet("GetBelow3HrEmployeeDailyDuration")]
        //public async Task<ActionResult<IEnumerable<sp_getbelow3hremployeedailyduration_Results>>> GetBelow3HrEmployeeDailyDuration([FromQuery] DateTime startDate, [FromQuery]  DateTime endDate)
        //{
        //    try
        //    {
        //        var result = await notificationService.GetBelow3HrEmployeeDailyDurationAsync(startDate, endDate);

        //        if (result != null && result.Any())
        //            return Ok(result);
        //        else
        //            return NotFound("No employee records found with daily duration below 3 hours for the given dates.");
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError($"Error in GetBelow3HrEmployeeDailyDuration: {ex.Message}", ex);
        //        return BadRequest("An error occurred while fetching the employee duration report.");
        //    }
        //}

        [HttpGet("GetBelow3HrEmployeeDailyDuration")]
        public async Task<ActionResult<IEnumerable<sp_getbelow3hremployeedailyduration_Results>>>GetBelow3HrEmployeeDailyDuration([FromQuery] string startDate, [FromQuery] string endDate)
        {
            try
            {
                var sDate = DateTime.ParseExact(
                    startDate,
                    "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture
                );

                var eDate = DateTime.ParseExact(
                    endDate,
                    "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture
                );

                var result = await notificationService
                    .GetBelow3HrEmployeeDailyDurationAsync(sDate, eDate);

                if (result != null && result.Any())
                    return Ok(result);

                return NotFound("No employee records found with daily duration below 3 hours.");
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetBelow3HrEmployeeDailyDuration: {ex}", ex);
                return BadRequest("Invalid date format. Expected yyyy-MM-dd.");
            }
        }


        [HttpGet("GetEmployeesNotTrackedYesterday")]
        public async Task<IActionResult> GetEmployeesNotTrackedYesterday()
        {
            var result = await notificationService.GetEmployeesNotTrackedYesterdayAsync();
            return Ok(result);
        }

        [HttpGet("onlineemployeedashboard")]
        public async Task<ActionResult<IEnumerable<sp_getonlineemployeedashboardsummary_Result>>>GetOnlineEmployeeDashboard([FromQuery] string userIds)
        {
            try
            {
                var result = await notificationService.GetOnlineEmployeeDashboardSummary(userIds);

                if (result != null && result.Any())
                    return Ok(result);
                else
                    return NotFound("No dashboard data found."); 
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetOnlineEmployeeDashboard: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }



    }
}
