using BusinessData.DataContext;
using BusinessService.Custom.User;
using BusinessApp.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BusinessApp.Settings;
using BusinessService.Custom.TrackerProject;
using AutoMapper;
using BusinessService.Custom.UtilizationTracker;
using BusinessService.Custom.Employee;
using BusinessService.Custom.TrackerSubProject;
using BusinessService.Custom.TrackerSubProjectCategory;
using BusinessService.Custom.PunchDetail;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class UtilizationTrackerController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        private readonly IEmployeeService _EmployeeService;
        private readonly ITrackerProjectService _TrackerProjectService;
        private readonly ITrackerSubProjectService _trackerSubProjectService;
        private readonly IUtilizationTrackerService _UtilizationTrackerService;
        public readonly IPunchDetailService _PunchDetailservice;
        public readonly ITrackerSubProjectCategoryService _TrackerSubProjectCategoryService;
        public UtilizationTrackerController(IMapper _mapper, ILogger<TrackerProjectController> _logger, 
            IUserService _userServices, ITrackerProjectService TrackerProjectService, 
            IUtilizationTrackerService UtilizationTrackerService, IEmployeeService EmployeeService, 
            ITrackerSubProjectService trackerSubProjectService, ITrackerSubProjectCategoryService TrackerSubProjectCategoryService, IPunchDetailService PunchDetailservice)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;            
            _UtilizationTrackerService = UtilizationTrackerService;
            _EmployeeService = EmployeeService;
            _TrackerProjectService = TrackerProjectService;
            _trackerSubProjectService = trackerSubProjectService;
            _TrackerSubProjectCategoryService = TrackerSubProjectCategoryService;
            _PunchDetailservice = PunchDetailservice;

        }


        [HttpGet("GetTopTrackerTaskEntry")]
        public async Task<ActionResult<GetTopTrackerTaskEntry_Result>> GetTopTrackerTaskEntry(int empid)
        {
            try
            {
                var result = await _UtilizationTrackerService.GetTopTrackerTaskEntrylist(empid);

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


        [HttpGet("GetTrackerTask/{empid}")]
        public async Task<ActionResult<GetTopTrackerTaskEntry_Result>> Get(int empid)
        {
            try
            {
                UtilizationTrackerModel model = new UtilizationTrackerModel();
                IEnumerable<GetTopTrackerTaskEntry_Result> result  = await _UtilizationTrackerService.GetTopTrackerTaskEntrylist(empid);
                List<GetTopTrackerTaskEntry_Result> asList = result.ToList();
                if (result.Count() > 0)
                {
                    TblToptrackerTask trackertask = await _UtilizationTrackerService.Get(asList[0].ID);
                    model = Mapper.Map<UtilizationTrackerModel>(trackertask);
                }
                if (model != null)
                    return Ok(model);
                else
                    return Ok(model);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }
        [HttpPost("AddEditTrackerTask")]
        public async Task<ActionResult<TblToptrackerTask>> AddEditTrackerTask(UtilizationTrackerModel model)
        {
            try
            {
                bool isResult = false;
                IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                model.StartTime = datetimenowList[0].ServerTime;
                TblToptrackerTask trackertask = Mapper.Map<UtilizationTrackerModel, TblToptrackerTask>(model);
                TblToptrackerTask obj = Mapper.Map<UtilizationTrackerModel, TblToptrackerTask>(model);
                //if (model.button == "start")
                 if (model.ID == 0)
                 {
                    trackertask.ActiveInvoice = true;
                    isResult = await _UtilizationTrackerService.tblinsert(trackertask);

                    if (isResult)
                    {
                        return Ok();
                    }
                }
                else
                {
                    int employee_id = model.Employeeid;


                    IEnumerable<GetTopTrackerTaskEntry_Result> offset =await _UtilizationTrackerService.GetTopTrackerTaskEntrylist(employee_id);
                    List<GetTopTrackerTaskEntry_Result> asList = offset.ToList();

                    if (asList.Count > 0)
                    {
                        bool Result = false;
                        TblToptrackerTask trackertask1 = await _UtilizationTrackerService.Get(asList[0].ID);
                        trackertask1.EndTime = datetimenowList[0].ServerTime;
                        trackertask1.UpdatedDate = datetimenowList[0].ServerTime;
                        TimeSpan ts = (trackertask1.StartTime - trackertask1.EndTime) ?? TimeSpan.Zero; ;
                        trackertask1.Activity = model.Activity;
                        trackertask1.ProjectId = model.ProjectId;
                        trackertask1.SubprojectId = model.SubProjectId;
                        trackertask1.SubprojectcategoryId = model.SubProjectCategoryId;
                        trackertask1.Duration = ts.ToString(@"hh\:mm\:ss");

                        Result = await _UtilizationTrackerService.tblupdate(trackertask1);
                        if (Result)
                        {
                            return Ok();
                        }
                        else
                        {
                            return BadRequest();
                        }

                    }
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : {ex}");
            }
            return BadRequest();
        }

        [HttpGet("EditTrackertask/{id}")]
        public async Task<ActionResult<TblToptrackerTask>> EditTrackertask(int id = 0)
        {
            try
            {
                UtilizationTrackerModel model = new UtilizationTrackerModel();
                var data = await _UtilizationTrackerService.Get(id);
                model = Mapper.Map<UtilizationTrackerModel>(data);

                if (model != null)
                    return Ok(model);
                else
                    return Ok(model);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }

        [HttpPost("EditTrackertask")]
        public async Task<ActionResult<UtilizationTrackerModel>> EditTrackertask(UtilizationTrackerModel model)
        {
            try
            {
                bool isResult = false;
                IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                model.Updateddate = datetimenowList[0].ServerTime;
                model.ActivityUpdateddate = datetimenowList[0].ServerTime;
                model.ActivityUpdatedby = model.Employeeid;
                TblToptrackerTask obj = Mapper.Map<UtilizationTrackerModel, TblToptrackerTask>(model);
                if (obj.Id != 0)
                {
                    isResult = await _UtilizationTrackerService.tblupdate(obj);
                }
                else
                {
                    isResult = await _UtilizationTrackerService.tblinsert(obj);
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


        [HttpPost("addwatchertrackertask")]
        public async Task<ActionResult<UtilizationTrackerModel>> AddWatcherTrackertask(UtilizationTrackerModel model)
        {
            try
            {
                bool isResult = false;

                IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                model.Updateddate = datetimenowList[0].ServerTime;
                TblToptrackerTask obj = Mapper.Map<UtilizationTrackerModel, TblToptrackerTask>(model);
                if (obj.Id != 0)
                {
                    isResult = await _UtilizationTrackerService.tblupdate(obj);
                }
                else
                {
                    isResult = await _UtilizationTrackerService.tblinsert(obj);
                }
                if (isResult)
                {
                    return Ok(obj.Id);
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





        [HttpDelete("DeActivateTrackertask/{id:int}")]
        public async Task<ActionResult> DeActivateTrackertask(int id)
        {
            try
            {
                var result = await _UtilizationTrackerService.tbldelete(id);
                if (result)
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
                Logger.LogError($"Error : {ex}");
                return BadRequest();
            }
        }

        //[HttpGet("GetTrackerProject")]
        //public async Task<ActionResult<TblTrackerProject>> GetTrackerProject(int companyid, int branchid)
        //{
        //    try
        //    {
        //        var result = await _TrackerProjectService.GetTrackerProjectList(companyid, branchid);

        //        if (result != null)
        //        {
        //            List<TblTrackerProject> results = new List<TblTrackerProject>();
        //            results.Add(new TblTrackerProject { Id = 0, Project = "--Select--" });
        //            results.AddRange(result.Select(d => new TblTrackerProject { Project = d.Project, Id = d.Id }).ToList());
        //            return Ok(results);
        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //        Logger.LogError($"Error: {ex}");
        //        return BadRequest();
        //    }
        //}




        //# Start_ClientforGetProjectID
        [HttpGet("GetTrackerProject")]
        public async Task<ActionResult<IEnumerable<TblTrackerProject>>> GetTrackerProject(int companyid, int branchid, int adminId = 0)
        {
            try
            {
                var result = await _TrackerProjectService.GetTrackerProjectList(companyid, branchid, adminId);

                if (result != null && result.Any())
                {
                    var results = new List<TblTrackerProject>
            {
                new TblTrackerProject { Id = 0, Project = "--Select--" }
            };

                    results.AddRange(result.Select(d => new TblTrackerProject
                    {
                        Project = d.Project,
                        Id = d.Id
                    }));

                    return Ok(results);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }


        //# END_ClientforGetProjectID



        [HttpGet("GetTrackerProjectclient")]
        public async Task<ActionResult<TblTrackerProject>> GetTrackerProjectclient(int companyid, int branchid)
        {
            try
            {
                var result = await _TrackerProjectService.GetTrackerProjectListclient(companyid, branchid);
                return Ok(result);
                //if (result != null)
                //{

                //    List<TblTrackerProject> results = new List<TblTrackerProject>();
                //    results.Add(new TblTrackerProject { Id = 0, Project = "--Select--" });
                //    results.AddRange(result.Select(d => new TblTrackerProject { Project = d.Project, Id = d.Id }).ToList());
                //    return Ok(results);
                //}
                //else
                //{
                //    return NotFound();
                //}
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetTopTrackerTaskEntryList")]
        public async Task<ActionResult<GetTopTrackerTaskEntry_Result>> GetTopTrackerTaskEntryList(int empid)
        {
            try
            {
                var result = await _UtilizationTrackerService.GetTopTrackerTaskEntrylist(empid);

                if (result != null)
                {
                    List<GetTopTrackerTaskEntry_Result> results = new List<GetTopTrackerTaskEntry_Result>();
                    results.AddRange(result.Select(d => new GetTopTrackerTaskEntry_Result { Start_time = d.Start_time, ID = d.ID }).ToList());
                    return Ok(results);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetTrackerSubProjectCategory")]
        public async Task<ActionResult<TblTrackerSubProjectCategory>> GetTrackerSubProjectCategory(int projectid, int subprojectcategoryid)
        {
            try
            {
                var result = await _TrackerSubProjectCategoryService.GetTrackerSubProjectCategoryList(projectid, subprojectcategoryid);
                List<TblTrackerSubProjectCategory> results = new List<TblTrackerSubProjectCategory>();
                List<TblTrackerSubProjectCategory> obj1 = result.ToList();
                if (obj1.Count() > 0)
                {
                    results.Add(new TblTrackerSubProjectCategory { Id = 0, Subcategory = "--Select--" });
                    results.AddRange(result.Select(d => new TblTrackerSubProjectCategory { Subcategory = d.Subcategory, Id = d.Id }).ToList());
                }
                else if ((obj1.Count() == 0) && (projectid != 0) && (subprojectcategoryid != 0))
                {

                    results.Add(new TblTrackerSubProjectCategory { Id = 909090, Subcategory = "General" });
                    results.AddRange(result.Select(d => new TblTrackerSubProjectCategory { Subcategory = d.Subcategory, Id = d.Id }).ToList());
                }
                return Ok(results);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("GetTrackerSubProject/{projectid}")]
        public async Task<ActionResult<TblTrackerSubProject>> GetTrackerSubProject(int projectid)
            {
            try
            {
                var result = await _trackerSubProjectService.GetTrackerSubProjectList(projectid);

                if (result != null)
                {
                    List<TblTrackerSubProject> results = new List<TblTrackerSubProject>();
                    results.Add(new TblTrackerSubProject { Id = 0, Subcategory = "--Select--" });
                    results.AddRange(result.Select(d => new TblTrackerSubProject { Subcategory = d.Subcategory, Id = d.Id }).ToList());
                    return Ok(results);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetProjectTask/{empid}")]
        public async Task<ActionResult<GetProjectTaskWithDuration_Result>> GetProjectTask(int empid)
        {
            try
            {
                var result = await _UtilizationTrackerService.GetProjectTaskWithDuration(empid);

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
        [HttpDelete("deleteTrackerTask/{id:int}")]
        public async Task<ActionResult> DeleteTrackerTask(int id)
        {
            try
            {
                var result = await _UtilizationTrackerService.tbldelete(id);
                if (result)
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
                Logger.LogError($"Error : {ex}");
                return BadRequest();
            }
        }
        [HttpGet("GetActiveLogOfEmployee")] //Girish - 01202022
        public async Task<ActionResult<GetActiveLogOfEmployee_Result>> GetActiveLogOfEmployee(DateTime FromDate, DateTime ToDate, int EID, int UID)
        {
            try
            {

                IEnumerable<GetActiveLogOfEmployee_Result> result = await _UtilizationTrackerService.GetActiveLogOfEmployee(FromDate, ToDate, EID, UID);
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


        [HttpGet("GetActiveLogOfEmployeeclient")] //Girish - 06232023
        public async Task<ActionResult<GetActiveLogOfEmployee_VC_Result>> GetActiveLogOfEmployeeclient(DateTime FromDate, DateTime ToDate, int EID, int UID)
        {
            try
            {
                
                IEnumerable<GetActiveLogOfEmployee_VC_Result> result = await _UtilizationTrackerService.GetActiveLogOfEmployeeclient(FromDate,ToDate,EID,UID);
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

        [HttpGet("GetEmployeeList/{Companyid}")]
        public async Task<ActionResult<GetEmployerList_Result>> GetEmployeeList(int Companyid)
        {
            try
            {
                var result = await _EmployeeService.GetEmployerList(Companyid);

                if (result != null)
                {
                    List<GetEmployerList_Result> results = new List<GetEmployerList_Result>();
                    results.Add(new GetEmployerList_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetEmployerList_Result { Name = d.firstname +" " + d.lastname, ID = d.ID }).ToList());
                    return Ok(results);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        [HttpPost("CloneTask")]
        public async Task<ActionResult<TblToptrackerTask>> CloneTask(UtilizationTrackerModel model1)
        {
            try
            {
                bool Result = false;
                IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();

                IEnumerable<GetTopTrackerTaskEntry_Result> offset = await _UtilizationTrackerService.GetTopTrackerTaskEntrylist(model1.Employeeid);
                List<GetTopTrackerTaskEntry_Result> asList = offset.ToList();
                if (asList.Count > 0)
                {

                    TblToptrackerTask trackertask1 = await _UtilizationTrackerService.Get(asList[0].ID);
                    trackertask1.EndTime = datetimenowList[0].ServerTime;
                    trackertask1.UpdatedDate = datetimenowList[0].ServerTime;
                    TimeSpan ts = (trackertask1.StartTime - trackertask1.EndTime) ?? TimeSpan.Zero; ;
                    trackertask1.Duration = ts.ToString(@"hh\:mm\:ss");
                    trackertask1.Activity = model1.Activity;
                    trackertask1.ProjectId = model1.ProjectId;
                    trackertask1.SubprojectId = model1.SubProjectId;
                    trackertask1.SubprojectcategoryId = model1.SubProjectCategoryId;
                    trackertask1.IsAdmin = model1.IsAdmin;
                    Result = await _UtilizationTrackerService.tblupdate(trackertask1);

                    //var data = await _UtilizationTrackerService.Get(id);

                    //data.StartTime = System.DateTime.Now;
                }
                if(model1.CloneID > 0)
                {
                    UtilizationTrackerModel model = new UtilizationTrackerModel();
                    var data = await _UtilizationTrackerService.Get(model1.CloneID);
                    model.ActiveInvoice = true;
                    model.Activity = data.Activity;
                    model.Branchid = data.BranchId.Value;
                    model.Companyid = data.CompanyId.Value;
                    model.Duration = null;
                    model.Employeeid = data.EmployeeId.Value;
                    model.EndTime = null;
                    model.ID = 0;
                    model.ProjectId = data.ProjectId.Value;
                    model.StartTime = datetimenowList[0].ServerTime;
                    model.SubProjectId = data.SubprojectId.Value;
                    model.SubProjectCategoryId= data.SubprojectcategoryId.Value;
                    model.IsAdmin = data.IsAdmin.Value;
                    TblToptrackerTask trackertask = Mapper.Map<UtilizationTrackerModel, TblToptrackerTask>(model);
                    Result = await _UtilizationTrackerService.tblinsert(trackertask);
                    if (Result)
                    {
                        return Ok();
                    }
                }

                return Ok();

            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }


        //Task activity for client user

        [HttpGet("GetActiveLogOfClientProject")] // Girish - 05292025
        public async Task<ActionResult<IEnumerable<GetActiveLogOfEmployee_VC_Result>>> GetActiveLogOfClientProject(DateTime FromDate, DateTime ToDate, int EID, int UID, int AdminID)
        {
            try
            {
                var result = await _UtilizationTrackerService.GetActiveLogOfClientProject(FromDate, ToDate, EID, UID, AdminID);
                if (result != null)
                    return Ok(result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetActiveLogOfClientProject: {ex}");
                return BadRequest();
            }
        }


    }
}