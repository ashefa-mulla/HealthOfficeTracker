using System;
using System.Collections.Generic;
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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BusinessService.Custom.ProjectedvsActual;
using Microsoft.AspNetCore.Mvc.RazorPages;


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


        public ReportsController(IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, ITrackerProjectService TrackerProjectService, IUtilizationTrackerService UtilizationTrackerService
           , IEmployeeService EmployeeService, IPunchDetailService punchDetailService, IPurchaseOrderService purchaseOrderService, IProjectedvsActualService projectedvsActualService)
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
        [HttpGet("PrintAttendance/{month}")]
        public async Task<ActionResult<GetAttendanceReport_Result>> PrintAttendance(string month)
        {
            try
            {
                int m = Convert.ToInt16(month.Split('-')[1]);
                int y = Convert.ToInt16(month.Split('-')[0]);

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
                    dt.day29 = dt.day29 == "00:00" ? null : dt.day29;
                    dt.day30 = dt.day30 == "00:00" ? null : dt.day30;
                    dt.day31 = dt.day31 == "00:00" ? null : dt.day31;

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
        public async Task<ActionResult<GetEmployeeTaskSummaryByDate_Result>> PrintUserUtilizationReport(string stdt, string enddt)
        {
            try
            {
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
        public async Task<ActionResult<sp_GetEmployeeTaskSummaryByDate_Result>> PrintUserUtilizationwithperReport(string stdt, string enddt)
        {
            try
            {
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
        public async Task<ActionResult<GetUserTrackerTaskbyMonth_Result>> GetUserTrackerTaskwithAmount(int EID, string stdt, string enddt)
        {
            try
            {
                DateTime stdt1 = Convert.ToDateTime(stdt);
                DateTime enddt2 = Convert.ToDateTime(enddt);

                var result = await _utilizationTrackerService.GetUserTrackerTaskwithAmount(EID, stdt1, enddt2);

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


    }
}