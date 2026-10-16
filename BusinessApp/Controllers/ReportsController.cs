using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BusinessApp.Models;
using BusinessData.DataContext;
using BusinessService.Custom.Employee;
using BusinessService.Custom.PunchDetail;
using BusinessService.Custom.PurchaseOrder;
using BusinessService.Custom.TrackerProject;
using BusinessService.Custom.User;
using BusinessService.Custom.UtilizationTracker;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Reporting.NETCore;
using BusinessService.Custom.ProjectedvsActual;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BusinessService.Custom.LeaveTransaction;
using BusinessService.Custom.Evaluation;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        public readonly IPunchDetailService _punchDetailService;
        public readonly IEmployeeService _employeeService;
        public readonly IPurchaseOrderService _purchaseOrderService;
        private readonly ITrackerProjectService _trackerProjectService;
        private readonly IUtilizationTrackerService _utilizationTrackerService;
        private readonly IProjectedvsActualService _projectedvsActualService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILeaveTransactionService _leaveTransactionService;
        private readonly IEvaluationService _evaluationService;

        public ReportsController(IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, ITrackerProjectService TrackerProjectService, IUtilizationTrackerService UtilizationTrackerService
           , IEmployeeService EmployeeService, IPunchDetailService punchDetailService, IPurchaseOrderService purchaseOrderService, IProjectedvsActualService projectedvsActualService, IWebHostEnvironment hostingEnvironment, ILeaveTransactionService leaveTransactionService = null, IEvaluationService evaluationService = null)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _utilizationTrackerService = UtilizationTrackerService;
            _employeeService = EmployeeService;
            _trackerProjectService = TrackerProjectService;
            _punchDetailService = punchDetailService;
            _purchaseOrderService = purchaseOrderService;
            _projectedvsActualService = projectedvsActualService;
            _hostingEnvironment = hostingEnvironment;
            _leaveTransactionService = leaveTransactionService;
            _evaluationService = evaluationService;
        }

        [HttpGet("PrintPurchaseOrderReport/{poid}")]
        public async Task<ActionResult<POPaymentDueDateStmnt_Result>> PrintPurchaseOrderReport(int poid)
        {
            try
            {
                var result = await _purchaseOrderService.POPaymentDueDateStmnt(poid);

                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("PrientUserLogReport")]
        public async Task<ActionResult<GetUserLogReport_Result>> PrientGetUserLogReport(string stdt, string enddt)
        {
            try
            {
               DateTime stdt1 = Convert.ToDateTime(stdt);
               DateTime enddt2 = Convert.ToDateTime(enddt);
                var result = await _punchDetailService.GetUserLogReport(stdt1, enddt2);

                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("PrientUserLogReportByEmpID")]
        public async Task<ActionResult<GetUserLogReportByEmpID_Result>> GetUserLogReportByEmpID(string stdt, string enddt, int empid)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);
                var result = await _punchDetailService.GetUserLogReportByEmpID(stdt1, enddt2, empid);
                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetTrackerSummarybyMonth")]
        public async Task<ActionResult<GetTrackerSummarybyMonth_Result>> GetTrackerSummarybyMonth(string stdt, string enddt, int id, int invoiceactive)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);
                
                var result = await _utilizationTrackerService.GetTrackerSummarybyMonth(stdt1, enddt2, id, invoiceactive);                               
                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("GetTrackerTaskbyMonth")]
        public async Task<ActionResult<GetTrackerTaskbyMonth_Result>> GetTrackerTaskbyMonth(string stdt, string enddt, int id,int invoiceactive)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);


                var result = await _utilizationTrackerService.GetTrackerTaskbyMonth(stdt1, enddt2, id, invoiceactive);

                if (result != null)
                {
                    return Ok(result);
                }
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("GetTrackerProjectwithprojectid/{id}")]
        public async Task<ActionResult<GetTrackerProjectwithprojectid_Result>> GetTrackerProjectwithprojectid(int id)
        {
            try
            {
                var result = await _utilizationTrackerService.GetTrackerProjectwithprojectid(id);

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

        [HttpGet("PrintUtilizationUserTaskReport")]
        public async Task<ActionResult<GetSummaryOfEmployeeTask_Result>> PrintUtilizationUserTaskReport(string stdt, string enddt, int empid)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetSummaryOfEmployeeTask(stdt1, enddt2, empid);

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
        [HttpGet("GetActiveLogOfEmployee")]   //Girish - 01202022
        public async Task<ActionResult<GetActiveLogOfEmployee_Result>> GetActiveLogOfEmployee(string stdt, string enddt, int empid, int uid = 3)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetActiveLogOfEmployee(stdt1, enddt2, empid,uid);

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
        [HttpGet("PrintAttendance")]
        [HttpGet("PrintAttendance/{month}")]
        public async Task<IActionResult> PrintAttendance(string month = "", [FromQuery] string format = "json")
        {
            try
            {
                if (string.IsNullOrWhiteSpace(month))
                {
                    month = DateTime.Now.ToString("yyyy-MM");
                }

                if (string.Equals(format, "pdf", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "download", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "report", StringComparison.OrdinalIgnoreCase))
                {
                    return await DownloadAttendanceReport(month);
                }

                int m = Convert.ToInt16(month.Split('-')[1]);
                int y = Convert.ToInt16(month.Split('-')[0]);
                int daysInMonth = DateTime.DaysInMonth(y, m);

                var result = await _utilizationTrackerService.GetAttendanceReport(m, y);

                foreach(var dt in result)
                    {
                    dt.day1 = dt.day1 == "00:00" ? null : dt.day1;
                    dt.day2 = dt.day2 == "00:00" ? null : dt.day2;
                    dt.day3 = dt.day3 == "00:00" ? null : dt.day3;
                    dt.day4 = dt.day4 == "00:00" ? null : dt.day4;
                    dt.day5 = dt.day5 == "00:00" ? null : dt.day5;
                    dt.day6 = dt.day6 == "00:00" ? null : dt.day6;
                    dt.day7 = dt.day7 == "00:00" ? null : dt.day7;
                    dt.day8 = dt.day8 == "00:00" ? null : dt.day8;
                    dt.day9 = dt.day9 == "00:00" ? null : dt.day9;
                    dt.day10 = dt.day10 == "00:00" ? null : dt.day10;
                    dt.day11 = dt.day11 == "00:00" ? null : dt.day11;
                    dt.day12 = dt.day12 == "00:00" ? null : dt.day12;
                    dt.day13 = dt.day13 == "00:00" ? null : dt.day13;
                    dt.day14 = dt.day14 == "00:00" ? null : dt.day14;
                    dt.day15 = dt.day15 == "00:00" ? null : dt.day15;
                    dt.day16 = dt.day16 == "00:00" ? null : dt.day16;
                    dt.day17 = dt.day17 == "00:00" ? null : dt.day17;
                    dt.day18 = dt.day18 == "00:00" ? null : dt.day18;
                    dt.day19 = dt.day19 == "00:00" ? null : dt.day19;
                    dt.day20 = dt.day20 == "00:00" ? null : dt.day20;
                    dt.day21 = dt.day21 == "00:00" ? null : dt.day21;
                    dt.day22 = dt.day22 == "00:00" ? null : dt.day22;
                    dt.day23 = dt.day23 == "00:00" ? null : dt.day23;
                    dt.day24 = dt.day24 == "00:00" ? null : dt.day24;
                    dt.day25 = dt.day25 == "00:00" ? null : dt.day25;
                    dt.day26 = dt.day26 == "00:00" ? null : dt.day26;
                    dt.day27 = dt.day27 == "00:00" ? null : dt.day27;
                    dt.day28 = dt.day28 == "00:00" ? null : dt.day28;
                    dt.day29 = (daysInMonth < 29 || dt.day29 == "00:00") ? null : dt.day29;
                    dt.day30 = (daysInMonth < 30 || dt.day30 == "00:00") ? null : dt.day30;
                    dt.day31 = (daysInMonth < 31 || dt.day31 == "00:00") ? null : dt.day31;

                }

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
        [HttpGet("PrintUserUtilizationReport")]
        public async Task<IActionResult> PrintUserUtilizationReport(string stdt, string enddt, [FromQuery] string format = "json")
        {
            try
            {
                if (string.Equals(format, "pdf", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "download", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "report", StringComparison.OrdinalIgnoreCase))
                {
                    return await DownloadUserUtilizationReport(stdt, enddt);
                }

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetEmployeeTaskSummaryByDate(stdt1, enddt2);

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
        //added by GJ 03-31-2022 --10 NO report
        [HttpGet("PrintUserUtilizationwithperReport")]
        public async Task<IActionResult> PrintUserUtilizationwithperReport(string stdt, string enddt, [FromQuery] string format = "json")
        {
            try
            {
                if (string.Equals(format, "pdf", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "download", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "report", StringComparison.OrdinalIgnoreCase))
                {
                    return await DownloadUserPerUtilizationReport(stdt, enddt);
                }

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.Sp_GetEmployeeTaskSummaryByDate(stdt1, enddt2);

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
        [HttpGet("GetEmployeeBreakupsTaskSummaryByDate")]
        public async Task<ActionResult<GetEmployeeBreakupsTaskSummaryByDate_Result>> GetEmployeeBreakupsTaskSummaryByDate(string stdt, string enddt)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetEmployeeBreakupsTaskSummaryByDate(stdt1, enddt2);


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
        //Utilization Report with Project - Conrollar GJ 02-16-2022 - summary
        [HttpGet("PrintUtilizationReportwithProject")]
        public async Task<ActionResult<GetUtilizationReportDetailwithProject_Result>> GetUtilizationReportwithDetailProject(string stdt, string enddt, int empid, int projectid, int subprojectid)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetUtilizationReportSummarywithProject(stdt1, enddt2, empid, projectid, subprojectid);

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

        [HttpGet("DownloadUtilizationReportwithProject")]
        public async Task<IActionResult> DownloadUtilizationReportwithProject(string stdt, string enddt, int empid, int projectid, int subprojectid, int uid = 3)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                // 1. Fetch data sequentially (DbContext is not thread-safe)
                var summaryData = await _utilizationTrackerService.GetUtilizationReportSummarywithProject(stdt1, enddt2, empid, projectid, subprojectid);
                var detailData = await _utilizationTrackerService.GetUtilizationReportwithDetailProject(stdt1, enddt2, empid, uid, projectid, subprojectid);

                var summaryResult = summaryData?.ToList() ?? new List<GetUtilizationReportwithProject_Result>();
                var detailResult = detailData?.ToList() ?? new List<GetUtilizationReportDetailwithProject_Result>();

                if (!summaryResult.Any() && !detailResult.Any())
                {
                    return NotFound("No records found for the selected period.");
                }

                string empName = summaryResult.FirstOrDefault()?.Fullname 
                                 ?? detailResult.FirstOrDefault()?.Fullname 
                                 ?? "";

                // 2. Map Project Summary List
                int rowCounter = 0;
                List<UtilizationReportProjectSummaryItem> projectSummaryList = summaryResult.Select(x =>
                {
                    int sec = x.SECONDVALUE ?? 0;
                    string dur = !string.IsNullOrWhiteSpace(x.DURATION) ? x.DURATION : FormatSecondsToHm(sec);
                    return new UtilizationReportProjectSummaryItem
                    {
                        RowNo = ++rowCounter,
                        Project = x.Project ?? "",
                        SecondValue = sec,
                        Hours = Math.Round(sec / 3600.0, 2),
                        Duration = dur
                    };
                }).ToList();

                // 3. Map Daily Summary List (from detailResult grouped by OExecDate)
                List<UtilizationReportDailySummaryItem> dailySummaryList = detailResult
                    .Where(x => !string.IsNullOrEmpty(x.OExecDate))
                    .GroupBy(x =>
                    {
                        if (DateTime.TryParse(x.OExecDate, out var dt))
                            return dt.Date;
                        return DateTime.MinValue;
                    })
                    .OrderBy(g => g.Key)
                    .Select(g =>
                    {
                        int totalSec = g.Sum(x => x.SECONDVALUE ?? 0);
                        string formattedDate = g.Key == DateTime.MinValue
                            ? (g.FirstOrDefault()?.OExecDate ?? "")
                            : g.Key.ToString("MM/dd/yyyy");

                        return new UtilizationReportDailySummaryItem
                        {
                            FormattedDate = formattedDate,
                            SecondValue = totalSec,
                            Hours = Math.Round(totalSec / 3600.0, 2),
                            Duration = FormatSecondsToHm(totalSec)
                        };
                    }).ToList();

                // 4. Map Activity Log List
                List<UtilizationReportActivityLogItem> activityLogList = detailResult.Select(x =>
                {
                    string dateStr = "";
                    if (DateTime.TryParse(x.OExecDate, out var dt))
                        dateStr = dt.ToString("MM/dd/yyyy");
                    else
                        dateStr = x.OExecDate ?? "";

                    string timeRange = "";
                    if (!string.IsNullOrEmpty(x.Starttime) && !string.IsNullOrEmpty(x.Endtime))
                        timeRange = $"{x.Starttime} - {x.Endtime}";
                    else if (!string.IsNullOrEmpty(x.Starttime))
                        timeRange = x.Starttime;

                    int sec = x.SECONDVALUE ?? 0;
                    string dur = !string.IsNullOrEmpty(x.DURATION) ? x.DURATION : FormatSecondsToHm(sec);

                    bool isDateMismatch = false;
                    if (!string.IsNullOrWhiteSpace(x.OOutDate) && x.Updated_date.HasValue)
                    {
                        if (DateTime.TryParse(x.OOutDate, out var outDt))
                        {
                            isDateMismatch = outDt.Date != x.Updated_date.Value.Date;
                        }
                    }

                    string textColor = isDateMismatch ? "#dc2626" : "#0f172a";

                    return new UtilizationReportActivityLogItem
                    {
                        ID = x.ID,
                        Fullname = x.Fullname ?? "",
                        Project = string.IsNullOrWhiteSpace(x.Project) ? "No Project" : x.Project,
                        Subcategory = string.IsNullOrWhiteSpace(x.Subcategory) ? "General" : x.Subcategory,
                        Subprojectcategory = string.IsNullOrWhiteSpace(x.subprojectcategory) ? "Default" : x.subprojectcategory,
                        FormattedDate = dateStr,
                        TimeRange = timeRange,
                        Activity = x.Activity ?? "",
                        Duration = dur,
                        SecondValue = sec,
                        Hours = Math.Round(sec / 3600.0, 2),
                        IsDateMismatch = isDateMismatch,
                        TextColor = textColor
                    };
                }).ToList();

                // 5. Calculate Totals
                int totalProjSec = projectSummaryList.Sum(x => x.SecondValue);
                int totalDailySec = dailySummaryList.Sum(x => x.SecondValue);
                int totalActivitySec = activityLogList.Sum(x => x.SecondValue);

                string totalProjectHours = FormatSecondsToHm(totalProjSec);
                string totalDailyHours = FormatSecondsToHm(totalDailySec);
                string totalActivityHours = FormatSecondsToHm(totalActivitySec);

                // 6. Setup RDLC Report
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptUtilizationReportWithProject.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 7. Bind DataSources
                report.DataSources.Add(new ReportDataSource("ProjectSummary", projectSummaryList));
                report.DataSources.Add(new ReportDataSource("DailySummary", dailySummaryList));
                report.DataSources.Add(new ReportDataSource("ActivityLog", activityLogList));

                // 8. Setup Parameters
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                if (!System.IO.File.Exists(logoPath))
                {
                    logoPath = System.IO.Path.Combine(reportpath, "assets", "img", "Logo", "Small-VO-LOGO.png");
                }
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";
                string dateRange = $"{stdt1:MM/dd/yyyy} - {enddt2:MM/dd/yyyy}";

                ReportParameter[] parameters =
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("empname", empName),
                    new ReportParameter("sdate", stdt1.ToString("MM/dd/yyyy")),
                    new ReportParameter("edate", enddt2.ToString("MM/dd/yyyy")),
                    new ReportParameter("dateRange", dateRange),
                    new ReportParameter("totalProjectHours", totalProjectHours),
                    new ReportParameter("totalDailyHours", totalDailyHours),
                    new ReportParameter("totalActivityHours", totalActivityHours),
                    new ReportParameter("companyName", "HEALTHOFFICEMD, LLC"),
                    new ReportParameter("companyAddress", "5105 S US Highway 41, Suite 175, Terre Haute, Indiana 47802")
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 9. Render & Return PDF
                byte[] pdf = report.Render("PDF");
                string safeEmpName = string.Join("_", empName.Split(System.IO.Path.GetInvalidFileNameChars()));
                string fileName = $"WorkSummary_Project_{safeEmpName}_{stdt1:MMddyyyy}_to_{enddt2:MMddyyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadUtilizationReportwithProject: {ex}");
                return BadRequest(errorMsg);
            }
        }
        [HttpGet("GetUtilizationReportDetailwithProject")]   //Girish - 01202022
        public async Task<ActionResult<GetUtilizationReportDetailwithProject_Result>> GetUtilizationReportwithDetailProject(string stdt, string enddt, int empid, int projectid, int subprojectid, int uid = 3)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetUtilizationReportwithDetailProject(stdt1, enddt2, empid, uid, projectid, subprojectid);

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

        [HttpGet("PrintGetUserTrackerTaskwithAmount")]
        public async Task<IActionResult> GetUserTrackerTaskwithAmount(int EID, string stdt, string enddt, [FromQuery] string format = "json", [FromQuery] int? empid = null)
        {
            try
            {
                int effectiveEid = EID != 0 ? EID : (empid ?? 0);
                if (string.Equals(format, "pdf", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "download", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(format, "report", StringComparison.OrdinalIgnoreCase))
                {
                    return await DownloadUserTrackerTaskwithAmount(effectiveEid, stdt, enddt);
                }

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetUserTrackerTaskwithAmount(effectiveEid, stdt1, enddt2);

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



        //added by GJ 2022 08-16

        [HttpGet("GetReportDetailwithEmployee")]
        public async Task<ActionResult<GetUtilizationReportDetailwithProjectbyEmployee_Result>> GetReportDetailwithProjectbyEmployee(string stdt, string enddt, int eid, int projid)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetReportDetailwithProjectbyEmployee(stdt1, enddt2, eid, projid);

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



        // GJ updates 2022 08-30 company cost vs employee cost
        [HttpGet("employeereport")]
        public async Task<ActionResult<GetUtilizationReportDetailwithProjectbyEmployee_Result>> PrintemployeecostReport(string stdt, string enddt, int eid)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                //var result = await _utilizationTrackerService.employeecost(stdt1, enddt2, EID);
                var result = await _utilizationTrackerService.employeecost(stdt1, enddt2, eid);

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

        //[HttpGet("employeereport")]
        //public async Task<ActionResult<GetUtilizationReportDetailwithProjectbyEmployee_Result>> PrintemployeecostReport(string stdt, string enddt, int EID)
        //{
        //    try
        //    {
        //        DateTime stdt1 = Convert.ToDateTime(stdt);
        //        DateTime enddt2 = Convert.ToDateTime(enddt);

        //        //var result = await _utilizationTrackerService.employeecost(stdt1, enddt2, EID);
        //        var result = await _utilizationTrackerService.employeecost(stdt1, enddt2, EID);

        //        if (result != null && result.Any())
        //            return Ok(result);
        //        else
        //            return Ok(null);
        //    }
        //    catch (Exception ex)
        //    {

        //        Logger.LogError($"Error: {ex}");
        //        return BadRequest();
        //    }
        //}




        //report 11 company cost vs employeecost
        [HttpGet("companyincomevscompanycost")]   //Girish - 20230613
        public async Task<ActionResult<GetCompanyincomevsCompanycost_Result>> GetCompanyIncomeVSCompanycost(string stdt, string enddt, int empid, int projectid, int subprojectid, int uid = 3)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetCompanyIncomeVSCompanycost(stdt1, enddt2, empid, uid, projectid, subprojectid);

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


        [HttpPost("updateprojectedvsactualincome")]
        public async Task<ActionResult<ProjectedvsActualModel>> AddEditActualincome(ProjectedvsActualModel model)
        {
            try
            {
                bool isResult = false;
                TblProjectedvsActual obj = Mapper.Map<ProjectedvsActualModel, TblProjectedvsActual>(model);
                if (obj.Id != 0)
                {
                    isResult = await _projectedvsActualService.tblupdate(obj);
                }
                else
                {
                    isResult = await _projectedvsActualService.tblinsert(obj);
                }
                if (isResult)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : {ex}");
            }
            return BadRequest();
        }


        //added  2024 09-17
        [HttpGet("updateactualincome")]
        public async Task<ActionResult<UpdateTrackerSummarybyMonth_ProjectedvsActual_Result>> UpdateActualIncome(string month, string year)
        {
            try
            {
                var result = await _projectedvsActualService.UpdateActualIncome(month, year);

                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        //new for total hours graph

        [HttpGet("GetBillabletotalHoursAndAmountByProject")]
        public async Task<ActionResult<IEnumerable<GetBillableHoursAndAmountByProject_Result>>> GetBillabletotalHoursAndAmountByProject(string stdt, string enddt)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);
                var result = await _utilizationTrackerService.GetBillabletotalHoursAndAmountByProject(stdt1, enddt2);

                return Ok(result.Any() ? result : null);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("DownloadActiveLogReport")]
        public async Task<IActionResult> DownloadActiveLogReport(string stdt, string enddt, int empid, int uid = 3)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime fdate = Convert.ToDateTime(stdt);
                DateTime tdate = Convert.ToDateTime(enddt);

                // 1. Fetch data
                var result = await _utilizationTrackerService.GetActiveLogOfEmployee(fdate, tdate, empid, uid);
                List<GetActiveLogOfEmployee_Result> data = result as List<GetActiveLogOfEmployee_Result> 
                                                          ?? result?.ToList() 
                                                          ?? new List<GetActiveLogOfEmployee_Result>();

                if (data == null || !data.Any())
                    return NotFound("Activity log records not found");

                // 2. Prepare LocalReport
                LocalReport report = new LocalReport();
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptGetActiveLogOfEmployee.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                ReportDataSource rds = new ReportDataSource { Name = "GetActiveLogOfEmployee", Value = data };
                report.DataSources.Add(rds);

                // 3. Totals & Parameters
                string employeeName = data.FirstOrDefault()?.Fullname ?? "";
                int totalSeconds = data.Sum(x => x.SECONDVALUE ?? 0);
                int hours = totalSeconds / 3600;
                int minutes = (totalSeconds % 3600) / 60;
                string totalHours = $"{hours:D2}:{minutes:D2}";

                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                ReportParameter[] parameters =
                {
                    new ReportParameter("sdate", fdate.ToString("MM/dd/yyyy")),
                    new ReportParameter("edate", tdate.ToString("MM/dd/yyyy")),
                    new ReportParameter("empname", employeeName),
                    new ReportParameter("totalHours", totalHours),
                    new ReportParameter("logoPath", reportLogo)
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 4. Render & Return PDF
                byte[] pdf = report.Render("PDF");
                string safeName = string.Join("_", employeeName.Split(System.IO.Path.GetInvalidFileNameChars()));
                string fileName = $"ActivityLog_{safeName}_{fdate:MM-dd-yyyy}_to_{tdate:MM-dd-yyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in DownloadActiveLogReport: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("DownloadPurchaseOrderReport/{poid}")]
        public async Task<IActionResult> DownloadPurchaseOrderReport(int poid)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                // 1. Fetch data
                var result = await _purchaseOrderService.POPaymentDueDateStmnt(poid);
                List<POPaymentDueDateStmnt_Result> data = result as List<POPaymentDueDateStmnt_Result>
                                                          ?? result?.ToList()
                                                          ?? new List<POPaymentDueDateStmnt_Result>();

                if (data == null || !data.Any())
                    return NotFound("Purchase order records not found");

                // 2. Prepare LocalReport
                LocalReport report = new LocalReport();
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptPurchaseOrder.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                ReportDataSource rds = new ReportDataSource { Name = "POPaymentDueDateStmnt", Value = data };
                report.DataSources.Add(rds);

                // 3. Metadata & Parameters
                var firstRecord = data.FirstOrDefault();
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                ReportParameter[] parameters =
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("poCode", firstRecord?.Code ?? ""),
                    new ReportParameter("processMethod", firstRecord?.ProcessMethod ?? ""),
                    new ReportParameter("vendorName", firstRecord?.VendorName ?? ""),
                    new ReportParameter("categoryName", firstRecord?.CategoryName ?? "")
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 4. Render & Return PDF
                byte[] pdf = report.Render("PDF");
                string poCode = firstRecord?.Code ?? poid.ToString();
                string safePoCode = string.Join("_", poCode.Split(System.IO.Path.GetInvalidFileNameChars()));
                string fileName = $"PurchaseOrder_{safePoCode}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in DownloadPurchaseOrderReport: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("DownloadUserLogReport")]
        public async Task<IActionResult> DownloadUserLogReport(string stdt, string enddt, int empid = 0)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                List<UserLogReportItem> data = new List<UserLogReportItem>();
                string empName = "";
                string totalHours = "";

                if (empid == 0)
                {
                    var result = await _punchDetailService.GetUserLogReport(stdt1, enddt2);
                    if (result != null)
                    {
                        data = result.Select(x => new UserLogReportItem
                        {
                            shift_dt = x.shift_dt,
                            DayLoginCount = x.DayLoginCount,
                            shift_start_time = x.shift_start_time,
                            shift_end_time = x.shift_end_time,
                            EmployeeName = x.EmployeeName ?? "",
                            ToDoDetail = x.ToDoDetail ?? "",
                            SECONDVALUE = 0,
                            Duration = "",
                            ShiftDateDisplay = x.shift_dt.ToString("MMMM dd, yyyy"),
                            LogInDisplay = x.shift_start_time.HasValue ? x.shift_start_time.Value.ToString("HH:mm") : "",
                            LogOutDisplay = x.shift_end_time.HasValue ? x.shift_end_time.Value.ToString("HH:mm") : ""
                        }).ToList();
                    }
                }
                else
                {
                    var result = await _punchDetailService.GetUserLogReportByEmpID(stdt1, enddt2, empid);
                    if (result != null)
                    {
                        data = result.Select(x =>
                        {
                            int secs = x.SECONDVALUE ?? 0;
                            int h = secs / 3600;
                            int m = (secs % 3600) / 60;
                            int s = secs % 60;
                            string dur = secs > 0 ? $"{h:D2}:{m:D2}:{s:D2}" : "";

                            return new UserLogReportItem
                            {
                                shift_dt = x.shift_dt,
                                DayLoginCount = x.DayLoginCount,
                                shift_start_time = x.shift_start_time,
                                shift_end_time = x.shift_end_time,
                                EmployeeName = x.EmployeeName ?? "",
                                ToDoDetail = x.ToDoDetail ?? "",
                                SECONDVALUE = x.SECONDVALUE,
                                Duration = dur,
                                ShiftDateDisplay = x.shift_dt.ToString("MMMM dd, yyyy"),
                                LogInDisplay = x.shift_start_time.HasValue ? x.shift_start_time.Value.ToString("HH:mm") : "",
                                LogOutDisplay = x.shift_end_time.HasValue ? x.shift_end_time.Value.ToString("HH:mm") : ""
                            };
                        }).ToList();

                        empName = data.FirstOrDefault()?.EmployeeName ?? "";
                        int totalSecs = data.Sum(x => x.SECONDVALUE ?? 0);
                        int th = totalSecs / 3600;
                        int tm = (totalSecs % 3600) / 60;
                        int ts = totalSecs % 60;
                        totalHours = $"{th:D2}:{tm:D2}:{ts:D2}";
                    }
                }

                if (data == null || !data.Any())
                    return NotFound("Time sheet records not found");

                // 2. Prepare LocalReport
                LocalReport report = new LocalReport();
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptUserLogReport.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                ReportDataSource rds = new ReportDataSource { Name = "UserLogReport", Value = data };
                report.DataSources.Add(rds);

                // 3. Metadata & Parameters
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                ReportParameter[] parameters =
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("empid", empid.ToString()),
                    new ReportParameter("employeeName", empName),
                    new ReportParameter("totalHours", totalHours),
                    new ReportParameter("sdate", stdt1.ToString("MM/dd/yyyy")),
                    new ReportParameter("edate", enddt2.ToString("MM/dd/yyyy"))
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 4. Render & Return PDF
                byte[] pdf = report.Render("PDF");
                string safeName = empid > 0 && !string.IsNullOrEmpty(empName)
                    ? string.Join("_", empName.Split(System.IO.Path.GetInvalidFileNameChars()))
                    : "All";
                string fileName = $"TimeSheet_{safeName}_{stdt1:MM-dd-yyyy}_to_{enddt2:MM-dd-yyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in DownloadUserLogReport: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("DownloadMonthlyInvoiceReport")]
        public async Task<IActionResult> DownloadMonthlyInvoiceReport(string stdt, string enddt, int id, int invoicelayout = 1, int invoiceactive = 1)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                // 1. Fetch data from services
                var summaryResult = await _utilizationTrackerService.GetTrackerSummarybyMonth(stdt1, enddt2, id, invoiceactive);
                var taskResult = await _utilizationTrackerService.GetTrackerTaskbyMonth(stdt1, enddt2, id, invoiceactive);
                var projectResult = await _utilizationTrackerService.GetTrackerProjectwithprojectid(id);

                var proj = projectResult?.FirstOrDefault();

                // 2. Map Summary List
                int rowCounter = 0;
                List<MonthlyInvoiceSummaryItem> summaryList = summaryResult?.Select(s => new MonthlyInvoiceSummaryItem
                {
                    RowNo = ++rowCounter,
                    ProjectCategory = s.ProjectCategory ?? "",
                    Subcategory = s.Subcategory ?? "",
                    TotalNonBillableHours = s.TotalNonBillableHours ?? 0,
                    TotalHours = s.TotalHours ?? 0,
                    Rate = s.amount ?? 0,
                    Amount = (s.TotalHours ?? 0) * (s.amount ?? 0)
                }).ToList() ?? new List<MonthlyInvoiceSummaryItem>();

                // 3. Map Task List
                List<MonthlyInvoiceTaskItem> taskList = taskResult?.Select(t => new MonthlyInvoiceTaskItem
                {
                    Start_time = t.Start_time,
                    FormattedDate = t.Start_time.HasValue ? t.Start_time.Value.ToString("MM/dd/yyyy HH:mm") : "",
                    Activity = t.Activity ?? "",
                    Subcategory = t.Subcategory ?? "",
                    Subprojectcategory = t.subprojectcategory ?? "",
                    Person = t.Person ?? "",
                    NonBillableHours = t.nonbillablehoursvalue ?? 0,
                    Hours = t.hoursvalue ?? 0,
                    Rate = t.amount,
                    Amount = (t.hoursvalue ?? 0) * t.amount
                }).ToList() ?? new List<MonthlyInvoiceTaskItem>();

                // 4. Map Person Summary (for Layout 2)
                List<MonthlyInvoicePersonSummaryItem> personSummaryList = taskList
                    .GroupBy(t => t.Person)
                    .OrderBy(g => g.Key)
                    .Select(g => new MonthlyInvoicePersonSummaryItem
                    {
                        Person = g.Key,
                        NonBillableHours = g.Sum(x => x.NonBillableHours),
                        Hours = g.Sum(x => x.Hours),
                        Rate = 0,
                        Amount = 0
                    }).ToList();

                // 5. Select RDLC File
                string rdlcFileName = invoicelayout == 2 ? "rptMonthlyInvoiceWithPerson.rdlc" : "rptMonthlyInvoice.rdlc";
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", rdlcFileName);
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 6. Bind Data Sources
                report.DataSources.Add(new ReportDataSource("MonthlyInvoiceSummary", summaryList));
                report.DataSources.Add(new ReportDataSource("MonthlyInvoiceTasks", taskList));
                if (invoicelayout == 2)
                {
                    report.DataSources.Add(new ReportDataSource("MonthlyInvoicePersonSummary", personSummaryList));
                }

                // 7. Format Metadata & Parameters
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                string companyHeader = id == 25 ? "Aisha Daga\nHEALTHOFFICEMD, LLC" : "HEALTHOFFICEMD, LLC";
                string companyAddress = "2909 Chesterfield Way SE\nConyers, Georgia - 30013";
                string invoiceTitle = "INVOICE - SUMMARY";
                string arvoNo = "ARVO - " + enddt2.ToString("MMddyyyy");
                string invoiceDate = enddt2.ToString("MMM dd, yyyy");
                string fromDate = stdt1.ToString("MMM dd, yyyy");
                string toDate = enddt2.ToString("MMM dd, yyyy");
                string dateRange = $"{stdt1:MM/dd/yyyy} - {enddt2:MM/dd/yyyy}";

                string contactPerson = proj?.contact_person ?? "";
                string departmentText = id == 25 ? "Medical Affairs" : id == 1 ? "" : "Accounts Payable";
                string organizationName = proj?.Organization_name ?? "";

                List<string> addressParts = new List<string>();
                if (!string.IsNullOrWhiteSpace(proj?.Address_Line1)) addressParts.Add(proj.Address_Line1);
                if (!string.IsNullOrWhiteSpace(proj?.Address_Line2)) addressParts.Add(proj.Address_Line2);

                string cityStateZip = "";
                if (!string.IsNullOrWhiteSpace(proj?.City_name)) cityStateZip += proj.City_name;
                if (!string.IsNullOrWhiteSpace(proj?.State_name)) cityStateZip += (cityStateZip.Length > 0 ? ", " : "") + proj.State_name;
                if (!string.IsNullOrWhiteSpace(proj?.Zip)) cityStateZip += (cityStateZip.Length > 0 ? " " : "") + proj.Zip;
                if (!string.IsNullOrWhiteSpace(cityStateZip)) addressParts.Add(cityStateZip);

                if (!string.IsNullOrWhiteSpace(proj?.Country_name)) addressParts.Add(proj.Country_name);

                string clientAddress = string.Join("\n", addressParts);

                List<string> billToParts = new List<string>();
                if (!string.IsNullOrWhiteSpace(contactPerson)) billToParts.Add(contactPerson);
                if (!string.IsNullOrWhiteSpace(departmentText)) billToParts.Add(departmentText);
                if (!string.IsNullOrWhiteSpace(organizationName)) billToParts.Add(organizationName);
                if (!string.IsNullOrWhiteSpace(clientAddress)) billToParts.Add(clientAddress);
                string billToText = string.Join("\n", billToParts);

                string checkPayableText = "Please make checks payable to:  HEALTHOFFICEMD, LLC\nMail to: 2909 Chesterfield Way SE, Conyers, Georgia - 30013";

                ReportParameter[] parameters =
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("companyHeader", companyHeader),
                    new ReportParameter("companyAddress", companyAddress),
                    new ReportParameter("invoiceTitle", invoiceTitle),
                    new ReportParameter("arvoNo", arvoNo),
                    new ReportParameter("invoiceDate", invoiceDate),
                    new ReportParameter("fromDate", fromDate),
                    new ReportParameter("toDate", toDate),
                    new ReportParameter("dateRange", dateRange),
                    new ReportParameter("contactPerson", contactPerson),
                    new ReportParameter("departmentText", departmentText),
                    new ReportParameter("organizationName", organizationName),
                    new ReportParameter("clientAddress", clientAddress),
                    new ReportParameter("billToText", billToText),
                    new ReportParameter("checkPayableText", checkPayableText)
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 8. Render & Return PDF
                byte[] pdf = report.Render("PDF");
                string projectName = proj?.Name ?? proj?.Project ?? id.ToString();
                string safeProjectName = string.Join("_", projectName.Split(System.IO.Path.GetInvalidFileNameChars()));
                string fileName = $"Invoice_{enddt2:MMddyyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadMonthlyInvoiceReport: {ex}");
                return BadRequest(errorMsg);
            }
        }

        [HttpGet("DownloadUtilizationUserTaskReport")]
        public async Task<IActionResult> DownloadUtilizationUserTaskReport(string stdt, string enddt, int empid, int uid = 3)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                // 1. Fetch data from services sequentially (DbContext is not thread-safe)
                var taskSummaryData = await _utilizationTrackerService.GetSummaryOfEmployeeTask(stdt1, enddt2, empid);
                var activeLogData = await _utilizationTrackerService.GetActiveLogOfEmployee(stdt1, enddt2, empid, uid);

                var taskSummaryResult = taskSummaryData?.ToList() ?? new List<GetSummaryOfEmployeeTask_Result>();
                var activeLogResult = activeLogData?.ToList() ?? new List<GetActiveLogOfEmployee_Result>();

                if (!taskSummaryResult.Any() && !activeLogResult.Any())
                {
                    return NotFound("No records found for the selected period.");
                }

                string empName = taskSummaryResult.FirstOrDefault()?.Fullname 
                                 ?? activeLogResult.FirstOrDefault()?.Fullname 
                                 ?? "";

                // 2. Map Project Summary List
                int rowCounter = 0;
                List<UserTaskProjectSummaryItem> projectSummaryList = taskSummaryResult.Select(x =>
                {
                    int sec = x.SECONDVALUE ?? 0;
                    string dur = !string.IsNullOrWhiteSpace(x.DURATION) ? x.DURATION : FormatSecondsToHm(sec);
                    return new UserTaskProjectSummaryItem
                    {
                        RowNo = ++rowCounter,
                        Project = x.Project ?? "",
                        SecondValue = sec,
                        Hours = Math.Round(sec / 3600.0, 2),
                        Duration = dur
                    };
                }).ToList();

                // 3. Map Daily Summary List (grouped by Date from activeLog)
                List<UserTaskDailySummaryItem> dailySummaryList = activeLogResult
                    .Where(x => !string.IsNullOrEmpty(x.OExecDate))
                    .GroupBy(x =>
                    {
                        if (DateTime.TryParse(x.OExecDate, out var dt))
                            return dt.Date;
                        return DateTime.MinValue;
                    })
                    .OrderBy(g => g.Key)
                    .Select(g =>
                    {
                        int totalSec = g.Sum(x => x.SECONDVALUE ?? 0);
                        string formattedDate = g.Key == DateTime.MinValue
                            ? (g.FirstOrDefault()?.OExecDate ?? "")
                            : g.Key.ToString("MM/dd/yyyy");

                        return new UserTaskDailySummaryItem
                        {
                            FormattedDate = formattedDate,
                            SecondValue = totalSec,
                            Hours = Math.Round(totalSec / 3600.0, 2),
                            Duration = FormatSecondsToHm(totalSec)
                        };
                    }).ToList();

                // 4. Map Activity Log List
                List<UserTaskActivityLogItem> activityLogList = activeLogResult.Select(x =>
                {
                    string dateStr = "";
                    if (DateTime.TryParse(x.OExecDate, out var dt))
                        dateStr = dt.ToString("MM/dd/yyyy");
                    else
                        dateStr = x.OExecDate ?? "";

                    string timeRange = "";
                    if (!string.IsNullOrEmpty(x.Starttime) && !string.IsNullOrEmpty(x.Endtime))
                        timeRange = $"{x.Starttime} - {x.Endtime}";
                    else if (!string.IsNullOrEmpty(x.Starttime))
                        timeRange = x.Starttime;

                    int sec = x.SECONDVALUE ?? 0;
                    string dur = !string.IsNullOrEmpty(x.DURATION) ? x.DURATION : FormatSecondsToHm(sec);

                    return new UserTaskActivityLogItem
                    {
                        ID = x.ID,
                        Fullname = x.Fullname ?? "",
                        Project = string.IsNullOrWhiteSpace(x.Project) ? "No Project" : x.Project,
                        Subcategory = string.IsNullOrWhiteSpace(x.Subcategory) ? "General" : x.Subcategory,
                        Subprojectcategory = string.IsNullOrWhiteSpace(x.subprojectcategory) ? "Default" : x.subprojectcategory,
                        FormattedDate = dateStr,
                        TimeRange = timeRange,
                        Activity = x.Activity ?? "",
                        Duration = dur,
                        SecondValue = sec,
                        Hours = Math.Round(sec / 3600.0, 2)
                    };
                }).ToList();

                // 5. Calculate Totals
                int totalProjSec = projectSummaryList.Sum(x => x.SecondValue);
                int totalDailySec = dailySummaryList.Sum(x => x.SecondValue);
                int totalActivitySec = activityLogList.Sum(x => x.SecondValue);

                string totalProjectHours = FormatSecondsToHm(totalProjSec);
                string totalDailyHours = FormatSecondsToHm(totalDailySec);
                string totalActivityHours = FormatSecondsToHm(totalActivitySec);

                // 6. Setup RDLC Report
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptUtilizationUserTask.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 7. Bind DataSources
                report.DataSources.Add(new ReportDataSource("UserTaskProjectSummary", projectSummaryList));
                report.DataSources.Add(new ReportDataSource("UserTaskDailySummary", dailySummaryList));
                report.DataSources.Add(new ReportDataSource("UserTaskActivityLog", activityLogList));

                // 8. Setup Parameters
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";
                string dateRange = $"{stdt1:MM/dd/yyyy} - {enddt2:MM/dd/yyyy}";

                ReportParameter[] parameters =
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("empname", empName),
                    new ReportParameter("sdate", stdt1.ToString("MM/dd/yyyy")),
                    new ReportParameter("edate", enddt2.ToString("MM/dd/yyyy")),
                    new ReportParameter("dateRange", dateRange),
                    new ReportParameter("totalProjectHours", totalProjectHours),
                    new ReportParameter("totalDailyHours", totalDailyHours),
                    new ReportParameter("totalActivityHours", totalActivityHours)
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 9. Render & Return PDF
                byte[] pdf = report.Render("PDF");
                string safeEmpName = string.Join("_", empName.Split(System.IO.Path.GetInvalidFileNameChars()));
                string fileName = $"WorkSummary_{safeEmpName}_{stdt1:MMddyyyy}_to_{enddt2:MMddyyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadUtilizationUserTaskReport: {ex}");
                return BadRequest(errorMsg);
            }
        }


        [HttpGet("DownloadAttendanceReport/{month}")]
        public async Task<IActionResult> DownloadAttendanceReport(string month = "")
        {
            try
            {
                if (string.IsNullOrWhiteSpace(month))
                {
                    month = DateTime.Now.ToString("yyyy-MM");
                }

                int year = DateTime.Now.Year;
                int m = DateTime.Now.Month;

                if (month.Contains('-'))
                {
                    var parts = month.Split('-');
                    if (parts[0].Length == 4 && int.TryParse(parts[0], out int py) && int.TryParse(parts[1], out int pm))
                    {
                        year = py;
                        m = pm;
                    }
                    else if (int.TryParse(parts[0], out int pm2) && int.TryParse(parts[1], out int py2))
                    {
                        m = pm2;
                        year = py2;
                    }
                }
                else if (DateTime.TryParse(month, out var parsedDate))
                {
                    year = parsedDate.Year;
                    m = parsedDate.Month;
                }

                int daysInMonth = DateTime.DaysInMonth(year, m);
                DateTime firstDayOfMonth = new DateTime(year, m, 1);
                string monthTitle = firstDayOfMonth.ToString("MMMM - yyyy");

                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                // 1. Fetch attendance data from service
                var rawResult = await _utilizationTrackerService.GetAttendanceReport(m, year);
                var resultList = rawResult?.ToList() ?? new List<GetAttendanceReport_Result>();

                if (!resultList.Any())
                {
                    return NotFound("No attendance records found for the selected month.");
                }

                // 2. Pre-calculate day parameters (names, header background colors)
                var dayNames = new string[32];
                var dayHdrBgs = new string[32];
                for (int d = 1; d <= 31; d++)
                {
                    if (d <= daysInMonth)
                    {
                        var dt = new DateTime(year, m, d);
                        dayNames[d] = dt.ToString("ddd");
                        bool isWeekend = dt.DayOfWeek == DayOfWeek.Saturday || dt.DayOfWeek == DayOfWeek.Sunday;
                        dayHdrBgs[d] = isWeekend ? "#334155" : "#0f172a";
                    }
                    else
                    {
                        dayNames[d] = "-";
                        dayHdrBgs[d] = "#94a3b8";
                    }
                }

                // 3. Map AttendanceReportItem list
                int rowCounter = 0;
                var attendanceItems = new List<AttendanceReportItem>();

                foreach (var emp in resultList)
                {
                    var item = new AttendanceReportItem
                    {
                        RowNo = ++rowCounter,
                        EmployeeId = emp.employee_id,
                        Name = emp.Name ?? "",
                        WorkDays = emp.WorkDays
                    };

                    int presentCount = 0;
                    int absentCount = 0;
                    int halfDayCount = 0;

                    for (int d = 1; d <= 31; d++)
                    {
                        string rawVal = GetDayValue(emp, d);
                        if (rawVal == "00:00") rawVal = null;

                        if (d > daysInMonth)
                        {
                            item.SetDay(d, "", "#ffffff", "#ffffff", "Normal");
                        }
                        else
                        {
                            var dt = new DateTime(year, m, d);
                            bool isWeekend = dt.DayOfWeek == DayOfWeek.Saturday || dt.DayOfWeek == DayOfWeek.Sunday;

                            if (isWeekend)
                            {
                                if (!string.IsNullOrWhiteSpace(rawVal))
                                {
                                    presentCount++;
                                    item.SetDay(d, rawVal, "#f1f5f9", "#15803d", "Bold");
                                }
                                else
                                {
                                    item.SetDay(d, "-", "#f8fafc", "#94a3b8", "Normal");
                                }
                            }
                            else
                            {
                                // Weekday
                                if (string.IsNullOrWhiteSpace(rawVal))
                                {
                                    absentCount++;
                                    item.SetDay(d, "A", "#ff0000", "#ffffff", "Bold");
                                }
                                else
                                {
                                    presentCount++;
                                    if (string.Compare(rawVal, "07:00", StringComparison.Ordinal) < 0)
                                    {
                                        halfDayCount++;
                                        item.SetDay(d, rawVal, "#cd5c5c", "#ffffff", "Bold");
                                    }
                                    else if (string.Compare(rawVal, "09:00", StringComparison.Ordinal) > 0)
                                    {
                                        item.SetDay(d, rawVal, "#ffffff", "#16a34a", "Bold");
                                    }
                                    else
                                    {
                                        item.SetDay(d, rawVal, "#ffffff", "#0f172a", "Normal");
                                    }
                                }
                            }
                        }
                    }

                    item.PresentDays = presentCount;
                    item.AbsentDays = absentCount;
                    item.HalfDays = halfDayCount;

                    attendanceItems.Add(item);
                }

                // 4. Setup RDLC Report
                var reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptAttendanceReport.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 5. Bind DataSource
                report.DataSources.Add(new ReportDataSource("AttendanceData", attendanceItems));

                // 6. Setup Parameters
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                var paramList = new List<ReportParameter>
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("monthTitle", monthTitle),
                    new ReportParameter("companyName", "HEALTHOFFICEMD, LLC"),
                    new ReportParameter("companyAddress", "5105 S US Highway 41, Suite 175\nTerre Haute, Indiana 47802"),
                    new ReportParameter("daysInMonth", daysInMonth.ToString()),
                    new ReportParameter("hideDay29", (daysInMonth < 29).ToString().ToLower()),
                    new ReportParameter("hideDay30", (daysInMonth < 30).ToString().ToLower()),
                    new ReportParameter("hideDay31", (daysInMonth < 31).ToString().ToLower())
                };

                for (int d = 1; d <= 31; d++)
                {
                    paramList.Add(new ReportParameter($"d{d}_name", dayNames[d]));
                    paramList.Add(new ReportParameter($"d{d}_hdrBg", dayHdrBgs[d]));
                }

                report.SetParameters(paramList);
                report.Refresh();

                // 7. Render PDF
                byte[] pdf = report.Render("PDF");
                string fileName = $"Attendance_Report_{year}_{m:D2}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadAttendanceReport: {ex}");
                return BadRequest(errorMsg);
            }
        }

        [HttpGet("DownloadUserUtilizationReport")]
        public async Task<IActionResult> DownloadUserUtilizationReport(string stdt, string enddt)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                // 1. Fetch data sequentially (DbContext is not thread-safe)
                var taskSummaryData = await _utilizationTrackerService.GetEmployeeTaskSummaryByDate(stdt1, enddt2);
                var breakupsData = await _utilizationTrackerService.GetEmployeeBreakupsTaskSummaryByDate(stdt1, enddt2);

                var taskSummaryResult = taskSummaryData?.ToList() ?? new List<GetEmployeeTaskSummaryByDate_Result>();
                var breakupsResult = breakupsData?.ToList() ?? new List<GetEmployeeBreakupsTaskSummaryByDate_Result>();

                if (!taskSummaryResult.Any() && !breakupsResult.Any())
                {
                    return NotFound("No utilization records found for the selected date range.");
                }

                // 2. Map User Utilization Summary
                int summaryRowCounter = 0;
                var summaryItems = taskSummaryResult.Select(x =>
                {
                    int billable = x.Billable;
                    int nonBillable = x.Non_billable;
                    int voBillable = x.Vo_billable;
                    int total = x.Total;
                    double pct = total > 0 ? (billable * 100.0 / total) : 0.0;

                    return new UserUtilizationSummaryItem
                    {
                        RowNo = ++summaryRowCounter,
                        Fullname = x.Fullname ?? "",
                        BillableSec = billable,
                        NonBillableSec = nonBillable,
                        VoBillableSec = voBillable,
                        TotalSec = total,
                        BillableHours = FormatSecondsToHm(billable),
                        NonBillableHours = FormatSecondsToHm(nonBillable),
                        VoBillableHours = FormatSecondsToHm(voBillable),
                        TotalHours = FormatSecondsToHm(total),
                        BillableHoursDec = Math.Round(billable / 3600.0, 2),
                        NonBillableHoursDec = Math.Round(nonBillable / 3600.0, 2),
                        VoBillableHoursDec = Math.Round(voBillable / 3600.0, 2),
                        TotalHoursDec = Math.Round(total / 3600.0, 2),
                        BillablePercentage = Math.Round(pct, 2),
                        BillablePercentageFormatted = pct.ToString("0.00") + "%"
                    };
                }).ToList();

                // 3. Map Employee Project Breakups
                var projectGroups = breakupsResult
                    .Where(x => !string.IsNullOrWhiteSpace(x.Project))
                    .GroupBy(x => x.Project.Trim())
                    .OrderBy(g => g.Key);

                var breakupItems = new List<EmployeeProjectBreakupItem>();
                int breakupRowCounter = 0;

                foreach (var projGroup in projectGroups)
                {
                    string projectName = projGroup.Key;

                    var empGroups = projGroup
                        .GroupBy(x => new { x.Employee_id, Fullname = x.Fullname?.Trim() ?? "Unknown" })
                        .OrderBy(eg => eg.Key.Fullname);

                    foreach (var empGroup in empGroups)
                    {
                        int billableSec = empGroup
                            .Where(x => x.Active_Invoice == true)
                            .Sum(x => x.Secondvalue ?? 0);

                        int nonBillableSec = empGroup
                            .Where(x => x.Active_Invoice != true)
                            .Sum(x => x.Secondvalue ?? 0);

                        int totalSec = billableSec + nonBillableSec;

                        breakupItems.Add(new EmployeeProjectBreakupItem
                        {
                            RowNo = ++breakupRowCounter,
                            Project = projectName,
                            EmployeeId = empGroup.Key.Employee_id,
                            Fullname = empGroup.Key.Fullname,
                            BillableSec = billableSec,
                            NonBillableSec = nonBillableSec,
                            TotalSec = totalSec,
                            BillableHours = FormatSecondsToHm(billableSec),
                            NonBillableHours = FormatSecondsToHm(nonBillableSec),
                            TotalHours = FormatSecondsToHm(totalSec),
                            BillableHoursDec = Math.Round(billableSec / 3600.0, 2),
                            NonBillableHoursDec = Math.Round(nonBillableSec / 3600.0, 2),
                            TotalHoursDec = Math.Round(totalSec / 3600.0, 2)
                        });
                    }
                }

                // 4. Calculate Summary Totals
                int totalBillableSec = summaryItems.Sum(x => x.BillableSec);
                int totalNonBillableSec = summaryItems.Sum(x => x.NonBillableSec);
                int totalVoBillableSec = summaryItems.Sum(x => x.VoBillableSec);
                int totalTotalSec = summaryItems.Sum(x => x.TotalSec);
                double overallPct = totalTotalSec > 0 ? (totalBillableSec * 100.0 / totalTotalSec) : 0.0;

                string totalSummaryBillable = FormatSecondsToHm(totalBillableSec);
                string totalSummaryNonBillable = FormatSecondsToHm(totalNonBillableSec);
                string totalSummaryVoBillable = FormatSecondsToHm(totalVoBillableSec);
                string totalSummaryTotal = FormatSecondsToHm(totalTotalSec);
                string totalSummaryPercentage = overallPct.ToString("0.00") + "%";

                // 5. Setup RDLC Report
                string reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptUserUtilizationReport.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 6. Bind DataSources
                report.DataSources.Add(new ReportDataSource("UserUtilizationSummary", summaryItems));
                report.DataSources.Add(new ReportDataSource("EmployeeProjectBreakup", breakupItems));

                // 7. Setup Parameters
                string dateRange = $"{stdt1:MM/dd/yyyy} - {enddt2:MM/dd/yyyy}";
                string reportTitle = $"User Activity Log";
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                var paramList = new List<ReportParameter>
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("dateRange", dateRange),
                    new ReportParameter("companyName", "HEALTHOFFICEMD, LLC"),
                    new ReportParameter("companyAddress", "5105 S US Highway 41, Suite 175\nTerre Haute, Indiana 47802"),
                    new ReportParameter("reportTitle", reportTitle),
                    new ReportParameter("totalSummaryBillable", totalSummaryBillable),
                    new ReportParameter("totalSummaryNonBillable", totalSummaryNonBillable),
                    new ReportParameter("totalSummaryVoBillable", totalSummaryVoBillable),
                    new ReportParameter("totalSummaryTotal", totalSummaryTotal),
                    new ReportParameter("totalSummaryPercentage", totalSummaryPercentage)
                };

                report.SetParameters(paramList);
                report.Refresh();

                // 8. Render PDF
                byte[] pdf = report.Render("PDF");
                string fileName = $"User_Utilization_Report_{stdt1:MMddyyyy}_to_{enddt2:MMddyyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadUserUtilizationReport: {ex}");
                return BadRequest(errorMsg);
            }
        }

   
        [HttpGet("PrintUserUtilizationwithperReportReport")]
        public async Task<IActionResult> DownloadUserPerUtilizationReport(string stdt, string enddt)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                // 1. Fetch data sequentially (DbContext is not thread-safe)
                var taskSummaryData = await _utilizationTrackerService.Sp_GetEmployeeTaskSummaryByDate(stdt1, enddt2);
                var breakupsData = await _utilizationTrackerService.GetEmployeeBreakupsTaskSummaryByDate(stdt1, enddt2);

                var taskSummaryResult = taskSummaryData?.ToList() ?? new List<sp_GetEmployeeTaskSummaryByDate_Result>();
                var breakupsResult = breakupsData?.ToList() ?? new List<GetEmployeeBreakupsTaskSummaryByDate_Result>();

                if (!taskSummaryResult.Any() && !breakupsResult.Any())
                {
                    return NotFound("No productivity records found for the selected date range.");
                }

                // 2. Map User Per Utilization Summary
                int summaryRowCounter = 0;
                var summaryItems = taskSummaryResult.Select(x =>
                {
                    string totalH = x.TotalHours ?? "";
                    bool isTracked = !string.IsNullOrEmpty(totalH) && totalH.Trim().Length > 0 && totalH.Trim()[0] != '0';

                    return new UserPerUtilizationSummaryItem
                    {
                        RowNo = ++summaryRowCounter,
                        EmployeeId = !string.IsNullOrWhiteSpace(x.EmployeeId) ? x.EmployeeId : (x.EmpName ?? ""),
                        EmpName = x.EmpName ?? "",
                        FixedWorkingHours = !string.IsNullOrWhiteSpace(x.FixedWorkingHours) ? x.FixedWorkingHours : "00:00",
                        BillableHours = !string.IsNullOrWhiteSpace(x.BillableHours) ? x.BillableHours : "00:00",
                        NonBillableHours = !string.IsNullOrWhiteSpace(x.NonBillableHours) ? x.NonBillableHours : "00:00",
                        VoProduction = !string.IsNullOrWhiteSpace(x.VOProuduction) ? x.VOProuduction : "00:00",
                        TotalHours = !string.IsNullOrWhiteSpace(x.TotalHours) ? x.TotalHours : "00:00",
                        UtilizePer = !string.IsNullOrWhiteSpace(x.UtilizePer)
                            ? (x.UtilizePer.EndsWith("%") ? x.UtilizePer : x.UtilizePer + "%")
                            : "0.00%",
                        IsTracked = isTracked
                    };
                }).ToList();

                // 3. Map Employee Project Breakups
                var projectGroups = breakupsResult
                    .Where(x => !string.IsNullOrWhiteSpace(x.Project))
                    .GroupBy(x => x.Project.Trim())
                    .OrderBy(g => g.Key);

                var breakupItems = new List<EmployeeProjectBreakupItem>();
                int breakupRowCounter = 0;

                foreach (var projGroup in projectGroups)
                {
                    string projectName = projGroup.Key;

                    var empGroups = projGroup
                        .GroupBy(x => new { x.Employee_id, Fullname = x.Fullname?.Trim() ?? "Unknown" })
                        .OrderBy(eg => eg.Key.Fullname);

                    foreach (var empGroup in empGroups)
                    {
                        int billableSec = empGroup
                            .Where(x => x.Active_Invoice == true)
                            .Sum(x => x.Secondvalue ?? 0);

                        int nonBillableSec = empGroup
                            .Where(x => x.Active_Invoice != true)
                            .Sum(x => x.Secondvalue ?? 0);

                        int totalSec = billableSec + nonBillableSec;

                        breakupItems.Add(new EmployeeProjectBreakupItem
                        {
                            RowNo = ++breakupRowCounter,
                            Project = projectName,
                            EmployeeId = empGroup.Key.Employee_id,
                            Fullname = empGroup.Key.Fullname,
                            BillableSec = billableSec,
                            NonBillableSec = nonBillableSec,
                            TotalSec = totalSec,
                            BillableHours = FormatSecondsToHm(billableSec),
                            NonBillableHours = FormatSecondsToHm(nonBillableSec),
                            TotalHours = FormatSecondsToHm(totalSec),
                            BillableHoursDec = Math.Round(billableSec / 3600.0, 2),
                            NonBillableHoursDec = Math.Round(nonBillableSec / 3600.0, 2),
                            TotalHoursDec = Math.Round(totalSec / 3600.0, 2)
                        });
                    }
                }

                // 4. Calculate Summary Totals
                int totalExpectedSec = summaryItems.Sum(x => ParseHmToSeconds(x.FixedWorkingHours));
                int totalBilledSec = summaryItems.Sum(x => ParseHmToSeconds(x.BillableHours));
                int totalNonBilledSec = summaryItems.Sum(x => ParseHmToSeconds(x.NonBillableHours));
                int totalVoSec = summaryItems.Sum(x => ParseHmToSeconds(x.VoProduction));
                int totalTrackedSec = summaryItems.Sum(x => ParseHmToSeconds(x.TotalHours));

                double overallProductivityVal = totalExpectedSec > 0
                    ? (totalTrackedSec * 100.0 / totalExpectedSec)
                    : (totalTrackedSec > 0 ? 100.0 : 0.0);

                string totalExpected = FormatSecondsToHm(totalExpectedSec);
                string totalBilled = FormatSecondsToHm(totalBilledSec);
                string totalNonBilled = FormatSecondsToHm(totalNonBilledSec);
                string totalVoProduction = FormatSecondsToHm(totalVoSec);
                string totalTracked = FormatSecondsToHm(totalTrackedSec);
                string overallProductivity = overallProductivityVal.ToString("0.00") + "%";

                // 5. Setup RDLC Report
                string reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptUserPerUtilizationReport.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 6. Bind DataSources
                report.DataSources.Add(new ReportDataSource("UserPerUtilizationSummary", summaryItems));
                report.DataSources.Add(new ReportDataSource("EmployeeProjectBreakup", breakupItems));

                // 7. Setup Parameters
                string dateRange = $"{stdt1:MM/dd/yyyy} - {enddt2:MM/dd/yyyy}";
                string reportTitle = "Productivity Log";
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                var paramList = new List<ReportParameter>
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("reportTitle", reportTitle),
                    new ReportParameter("dateRange", dateRange),
                    new ReportParameter("sdate", stdt1.ToString("MM/dd/yyyy")),
                    new ReportParameter("edate", enddt2.ToString("MM/dd/yyyy")),
                    new ReportParameter("totalExpected", totalExpected),
                    new ReportParameter("totalBilled", totalBilled),
                    new ReportParameter("totalNonBilled", totalNonBilled),
                    new ReportParameter("totalVoProduction", totalVoProduction),
                    new ReportParameter("totalTracked", totalTracked),
                    new ReportParameter("overallProductivity", overallProductivity)
                };

                report.SetParameters(paramList);
                report.Refresh();

                // 8. Render PDF
                byte[] pdf = report.Render("PDF");
                string fileName = $"Productivity_Log_{stdt1:MMddyyyy}_to_{enddt2:MMddyyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadUserPerUtilizationReport: {ex}");
                return BadRequest(errorMsg);
            }
        }

       
        [HttpGet("DownloadLeaveTransactionReport/{month}")]
        public async Task<IActionResult> DownloadLeaveTransactionReport(
            string month = "",
            int? year = null,
            int empid = 0,
            bool currentyear = false,
            bool hidedate = false)
        {
            try
            {
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                bool isCurrentYear = currentyear || hidedate;
                int selectedYear = DateTime.Now.Year;
                int selectedMonth = DateTime.Now.Month;

                if (!string.IsNullOrWhiteSpace(month))
                {
                    month = month.Trim();
                    if (month.Contains('-'))
                    {
                        var parts = month.Split('-');
                        if (parts[0].Length == 4 && int.TryParse(parts[0], out int py) && int.TryParse(parts[1], out int pm))
                        {
                            selectedYear = py;
                            selectedMonth = pm;
                        }
                        else if (int.TryParse(parts[0], out int pm2) && int.TryParse(parts[1], out int py2))
                        {
                            selectedMonth = pm2;
                            selectedYear = py2;
                        }
                    }
                    else if (int.TryParse(month, out int pm3))
                    {
                        selectedMonth = pm3;
                    }
                    else if (DateTime.TryParse(month, out var parsedDate))
                    {
                        selectedYear = parsedDate.Year;
                        selectedMonth = parsedDate.Month;
                    }
                }

                if (year.HasValue && year.Value > 0)
                {
                    selectedYear = year.Value;
                }

                if (_leaveTransactionService == null)
                {
                    return BadRequest("Leave transaction service is not available.");
                }

                // 1. Fetch leave transaction data
                var rawData = await _leaveTransactionService.GetLeaveTransactionList(empid, selectedMonth, selectedYear, isCurrentYear);
                var rawList = rawData?.ToList() ?? new List<GetLeaveTransactionList_Result>();

                // 2. Format title period according to currentyear / hidedate
                string titlePeriod;
                if (isCurrentYear)
                {
                    titlePeriod = selectedYear.ToString();
                }
                else
                {
                    DateTime periodDate = new DateTime(selectedYear, Math.Clamp(selectedMonth, 1, 12), 1);
                    titlePeriod = periodDate.ToString("MMMM yyyy");
                }
                string reportTitle = $"Employee Leave Report ({titlePeriod})";

                // 3. Map to LeaveTransactionReportItem
                int rowCounter = 0;
                var reportItems = rawList.Select(dt =>
                {
                    string dateRange;
                    if (dt.start_date != default && dt.End_date != default && dt.start_date != DateTime.MinValue && dt.End_date != DateTime.MinValue)
                    {
                        dateRange = $"{dt.start_date:MM/dd/yyyy} - {dt.End_date:MM/dd/yyyy}";
                    }
                    else if (!string.IsNullOrWhiteSpace(dt.FromDate) && !string.IsNullOrWhiteSpace(dt.ToDate))
                    {
                        dateRange = $"{dt.FromDate} - {dt.ToDate}";
                    }
                    else
                    {
                        dateRange = "-";
                    }

                    double leaves = (double)(dt.Leaves ?? dt.PL ?? 0m);
                    double sickLeaves = (double)(dt.Sick_Leaves ?? dt.SL ?? 0m);
                    double lwp = (double)(dt.LWP ?? 0m);
                    double totalLeave = leaves + sickLeaves + lwp;
                    bool isApp = dt.isApprove == true;

                    return new LeaveTransactionReportItem
                    {
                        RowNo = ++rowCounter,
                        Id = dt.ID,
                        EmpId = dt.Emp_id,
                        Employee = string.IsNullOrWhiteSpace(dt.Employee) ? "Unknown Employee" : dt.Employee.Trim(),
                        StartDate = dt.start_date,
                        EndDate = dt.End_date,
                        LeaveDateRange = dateRange,
                        Leaves = leaves,
                        SickLeaves = sickLeaves,
                        Lwp = lwp,
                        TotalLeave = totalLeave,
                        LeavesDisplay = FormatLeaveNumber(leaves),
                        SickLeavesDisplay = FormatLeaveNumber(sickLeaves),
                        LwpDisplay = FormatLeaveNumber(lwp),
                        TotalLeaveDisplay = FormatLeaveNumber(totalLeave),
                        IsApprove = dt.isApprove,
                        ApprovedText = isApp ? "Yes" : "No"
                    };
                })
                .OrderBy(x => x.Employee)
                .ThenBy(x => x.StartDate)
                .ToList();

                // 4. Setup RDLC Report
                string reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptLeaveTransactionReport.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 5. Bind DataSource
                report.DataSources.Add(new ReportDataSource("LeaveTransactionList", reportItems));

                // 6. Setup Parameters & Totals
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                if (!System.IO.File.Exists(logoPath))
                {
                    logoPath = System.IO.Path.Combine(reportpath, "assets", "img", "Logo", "Small-VO-LOGO.png");
                }
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                double totalPL = reportItems.Sum(x => x.Leaves);
                double totalSL = reportItems.Sum(x => x.SickLeaves);
                double totalLWP = reportItems.Sum(x => x.Lwp);
                double grandTotal = reportItems.Sum(x => x.TotalLeave);

                var parameters = new List<ReportParameter>
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("reportTitle", reportTitle),
                    new ReportParameter("companyName", "HEALTHOFFICEMD, LLC"),
                    new ReportParameter("companyAddress", "5105 S US Highway 41, Suite 175, Terre Haute, Indiana 47802"),
                    new ReportParameter("period", titlePeriod),
                    new ReportParameter("totalPL", FormatLeaveNumber(totalPL)),
                    new ReportParameter("totalSL", FormatLeaveNumber(totalSL)),
                    new ReportParameter("totalLWP", FormatLeaveNumber(totalLWP)),
                    new ReportParameter("grandTotal", FormatLeaveNumber(grandTotal))
                };

                report.SetParameters(parameters);
                report.Refresh();

                // 7. Render PDF
                byte[] pdf = report.Render("PDF");
                string cleanPeriod = titlePeriod.Replace(" ", "_").Replace("/", "-");
                string fileName = $"Employee_Leave_Report_{cleanPeriod}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadLeaveTransactionReport: {ex}");
                return BadRequest(errorMsg);
            }
        }

        [HttpGet("PrintLeaveTransactionReport")]
        public async Task<IActionResult> PrintLeaveTransactionReport(
            string month = "",
            int? year = null,
            int empid = 0,
            bool currentyear = false,
            bool hidedate = false)
        {
            return await DownloadLeaveTransactionReport(month, year, empid, currentyear, hidedate);
        }
        [HttpGet("DownloadUserTrackerTaskwithAmount")]
        public async Task<IActionResult> DownloadUserTrackerTaskwithAmount(int EID, string stdt, string enddt, [FromQuery] int? empid = null)
        {
            try
            {
                int effectiveEid = EID != 0 ? EID : (empid ?? 0);
                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                // 1. Fetch data from service
                var rawResult = await _utilizationTrackerService.GetUserTrackerTaskwithAmount(effectiveEid, stdt1, enddt2);
                var dataList = rawResult?.ToList() ?? new List<GetUserTrackerTaskbyMonth_Result>();

                if (!dataList.Any())
                {
                    return NotFound("No production records found for the selected criteria.");
                }

                // 2. Identify employee name if specific employee selected
                string employeeName = "";
                if (effectiveEid != 0)
                {
                    employeeName = dataList.FirstOrDefault(x => !string.IsNullOrWhiteSpace(x.Person))?.Person ?? "";
                }

                // 3. Map to report items and compute totals
                int rowCounter = 0;
                int totalDurationSec = 0;
                decimal totalAmountSum = 0;

                var items = new List<UserTrackerTaskWithAmountItem>();

                // Order by Project, then Subcategory / ID
                var sortedData = dataList
                    .OrderBy(x => string.IsNullOrWhiteSpace(x.Project) ? "ZZZ" : x.Project)
                    .ThenBy(x => x.Subcategory)
                    .ThenBy(x => x.ID);

                foreach (var item in sortedData)
                {
                    int durSec = item.Duration;
                    totalDurationSec += durSec;

                    decimal rateVal = item.amount ?? 0;
                    decimal amtVal = item.TotalAmount ?? 0;
                    totalAmountSum += amtVal;

                    items.Add(new UserTrackerTaskWithAmountItem
                    {
                        RowNo = ++rowCounter,
                        Id = item.ID,
                        Person = item.Person ?? "",
                        Project = !string.IsNullOrWhiteSpace(item.Project) ? item.Project : "General",
                        ProjectDescription = item.Project_Description ?? "",
                        SubprojectId = item.subprojectid,
                        Subcategory = !string.IsNullOrWhiteSpace(item.Subcategory) ? item.Subcategory : "-",
                        DurationSec = durSec,
                        Duration = FormatSecondsToHm(durSec),
                        Rate = rateVal,
                        RateFormatted = rateVal > 0 ? $"${rateVal:N2}" : "$0.00",
                        TotalAmount = amtVal,
                        TotalAmountFormatted = amtVal > 0 ? $"${amtVal:N2}" : "$0.00"
                    });
                }

                string totalDurationFormatted = FormatSecondsToHm(totalDurationSec);
                string totalAmountFormatted = $"${totalAmountSum:N2}";

                // 4. Setup RDLC Report
                string reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptUserTrackerTaskWithAmount.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 5. Bind DataSource
                report.DataSources.Add(new ReportDataSource("UserTrackerTaskWithAmount", items));

                // 6. Setup Parameters
                string dateRange = $"{stdt1:MM/dd/yyyy} - {enddt2:MM/dd/yyyy}";
                string reportTitle = "Employee - Wise Production Report";
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                var paramList = new List<ReportParameter>
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("reportTitle", reportTitle),
                    new ReportParameter("dateRange", dateRange),
                    new ReportParameter("sdate", stdt1.ToString("MM/dd/yyyy")),
                    new ReportParameter("edate", enddt2.ToString("MM/dd/yyyy")),
                    new ReportParameter("empid", effectiveEid.ToString()),
                    new ReportParameter("empName", employeeName),
                    new ReportParameter("totalDuration", totalDurationFormatted),
                    new ReportParameter("totalAmount", totalAmountFormatted),
                    new ReportParameter("totalRecords", items.Count.ToString())
                };

                report.SetParameters(paramList);
                report.Refresh();

                // 7. Render PDF
                byte[] pdf = report.Render("PDF");
                string safeEmp = !string.IsNullOrWhiteSpace(employeeName) ? $"_{employeeName.Replace(" ", "_")}" : "";
                string fileName = $"Employee_Wise_Production_Report{safeEmp}_{stdt1:MMddyyyy}_to_{enddt2:MMddyyyy}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadUserTrackerTaskwithAmount: {ex}");
                return BadRequest(errorMsg);
            }
        }

        [HttpGet("DownloadMonthlyEvaluationReportSummary")]
        public async Task<IActionResult> DownloadMonthlyEvaluationReportSummary([FromQuery] int? year = null, [FromQuery] int? month = null, [FromQuery] string format = "pdf")
        {
            try
            {
                int evalYear = year ?? DateTime.Now.Year;
                int evalMonth = month ?? DateTime.Now.Month;

                if (evalMonth < 1 || evalMonth > 12)
                {
                    return BadRequest("Month must be between 1 and 12.");
                }

                if (_evaluationService == null)
                {
                    return StatusCode(500, "EvaluationService is not available.");
                }

                // 1. Fetch raw data from service
                var rawResult = await _evaluationService.GetMonthlyEvaluationReportSummary(evalYear, evalMonth);
                var dataList = rawResult?.ToList() ?? new List<sp_getmonthlyevaluationreportsummary_Results>();

                // Return JSON if explicitly requested
                if (string.Equals(format, "json", StringComparison.OrdinalIgnoreCase))
                {
                    if (dataList.Any())
                        return Ok(dataList);
                    else
                        return NotFound("No evaluation report summary found for the given parameters.");
                }

                if (!dataList.Any())
                {
                    return NotFound("No evaluation report summary found for the given parameters.");
                }

                string host = $"{Request.Scheme}://{Request.Host}/";
                string reportpath = _hostingEnvironment.ContentRootPath;

                // 2. Map data
                int rowCounter = 0;
                var items = dataList.Select(x => new MonthlyEvaluationReportSummaryItem
                {
                    RowNo = ++rowCounter,
                    EmployeeId = x.EmployeeID,
                    EmployeeName = x.EmployeeName ?? "",
                    ProfileImage = x.ProfileImage ?? "",
                    Week1 = x.Week1,
                    Week2 = x.Week2,
                    Week3 = x.Week3,
                    Week4 = x.Week4,
                    GrandTotal = x.GrandTotal
                }).ToList();

                // 3. Setup RDLC Report
                string reportFile = System.IO.Path.Combine(reportpath, "Reports", "rptMonthlyEvaluationReportSummary.rdlc");
                if (!System.IO.File.Exists(reportFile))
                    throw new FileNotFoundException("RDLC file not found", reportFile);

                LocalReport report = new LocalReport();
                LoadReportDefinitionSafe(report, reportFile);
                report.EnableExternalImages = true;

                // 4. Bind DataSource
                report.DataSources.Add(new ReportDataSource("MonthlyEvaluationReportSummary", items));

                // 5. Setup Parameters
                string reportTitle = $"Monthly Evaluation Report Summary - ({evalMonth}/{evalYear})";
                string logoPath = System.IO.Path.Combine(reportpath, "FileServer", "Logo", "Small-VO-LOGO.png");
                if (!System.IO.File.Exists(logoPath))
                {
                    logoPath = System.IO.Path.Combine(reportpath, "assets", "img", "Logo", "Small-VO-LOGO.png");
                }
                string reportLogo = System.IO.File.Exists(logoPath) ? new Uri(logoPath).AbsoluteUri : $"{host}FileServer/Logo/Small-VO-LOGO.png";

                var paramList = new List<ReportParameter>
                {
                    new ReportParameter("logoPath", reportLogo),
                    new ReportParameter("reportTitle", reportTitle),
                    new ReportParameter("month", evalMonth.ToString()),
                    new ReportParameter("year", evalYear.ToString()),
                    new ReportParameter("totalRecords", items.Count.ToString())
                };

                report.SetParameters(paramList);
                report.Refresh();

                // 6. Render PDF
                byte[] pdf = report.Render("PDF");
                string fileName = $"Monthly_Evaluation_Report_Summary_{evalMonth}_{evalYear}.pdf";

                return File(pdf, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                var baseEx = ex.GetBaseException();
                string errorMsg = $"{ex.Message}";
                if (baseEx != null && baseEx != ex && !errorMsg.Contains(baseEx.Message))
                {
                    errorMsg += $" --> {baseEx.Message}";
                }
                Exception curr = ex;
                while (curr.InnerException != null)
                {
                    curr = curr.InnerException;
                    if (!errorMsg.Contains(curr.Message))
                    {
                        errorMsg += $" | {curr.Message}";
                    }
                }
                Logger.LogError($"Error in DownloadMonthlyEvaluationReportSummary: {ex}");
                return BadRequest(errorMsg);
            }
        }

        private static string FormatLeaveNumber(double val)
        {
            return val % 1 == 0 ? val.ToString("0") : val.ToString("0.##");
        }

        private static string GetDayValue(GetAttendanceReport_Result r, int day)
        {
            return day switch
            {
                1 => r.day1,
                2 => r.day2,
                3 => r.day3,
                4 => r.day4,
                5 => r.day5,
                6 => r.day6,
                7 => r.day7,
                8 => r.day8,
                9 => r.day9,
                10 => r.day10,
                11 => r.day11,
                12 => r.day12,
                13 => r.day13,
                14 => r.day14,
                15 => r.day15,
                16 => r.day16,
                17 => r.day17,
                18 => r.day18,
                19 => r.day19,
                20 => r.day20,
                21 => r.day21,
                22 => r.day22,
                23 => r.day23,
                24 => r.day24,
                25 => r.day25,
                26 => r.day26,
                27 => r.day27,
                28 => r.day28,
                29 => r.day29,
                30 => r.day30,
                31 => r.day31,
                _ => null
            };
        }

        private static string FormatSecondsToHm(int totalSeconds)
        {
            int hours = totalSeconds / 3600;
            int minutes = (totalSeconds % 3600) / 60;
            return $"{hours:D2}:{minutes:D2}";
        }

        private static int ParseHmToSeconds(string hm)
        {
            if (string.IsNullOrWhiteSpace(hm)) return 0;
            hm = hm.Trim();
            var parts = hm.Split(':');
            if (parts.Length >= 2 && int.TryParse(parts[0], out int h) && int.TryParse(parts[1], out int m))
            {
                return (h * 3600) + (m * 60);
            }
            if (double.TryParse(hm, out double d))
            {
                return (int)Math.Round(d * 3600);
            }
            return 0;
        }

        private static void LoadReportDefinitionSafe(LocalReport report, string reportFilePath)
        {
            string rdlcContent = System.IO.File.ReadAllText(reportFilePath);
            if (rdlcContent.Contains("<ReportParametersLayout>"))
            {
                rdlcContent = Regex.Replace(
                    rdlcContent,
                    @"<ReportParametersLayout>[\s\S]*?</ReportParametersLayout>",
                    string.Empty);
            }

            using var ms = new System.IO.MemoryStream(System.Text.Encoding.UTF8.GetBytes(rdlcContent));
            report.LoadReportDefinition(ms);
        }

    }
}