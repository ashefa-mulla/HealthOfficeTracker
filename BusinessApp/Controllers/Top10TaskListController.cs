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
using AutoMapper;
using BusinessService.Custom.DailyToDo;
using BusinessService.Custom.PunchDetail;
using BusinessService.Custom.Employee;
using BusinessService.Custom.TrackerSubProject;
using BusinessService.Custom.TrackerSubProjectCategory;
using BusinessService.Custom.UtilizationTracker;
using BusinessService.Custom.TrackerProject;
using BusinessService.Custom.TaskActivity;
using Newtonsoft.Json;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Top10TaskListController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        public readonly IPunchDetailService _PunchDetailservice;
        private readonly ApplicationSettings appSettings;
        private readonly ITaskListService TaskListService;
        public readonly ITrackerSubProjectCategoryService TrackerSubProjectCategoryService;
        public readonly IPunchDetailService PunchDetailservice;
        private readonly IUtilizationTrackerService trackertaskservice;
        public Top10TaskListController(IOptions<ApplicationSettings> _appSettings, IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, IPunchDetailService PunchDetailservice, ITaskListService _TaskListService, IUtilizationTrackerService _trackertaskservice)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            TaskListService = _TaskListService;
            _PunchDetailservice = PunchDetailservice;
            appSettings = _appSettings.Value;
            trackertaskservice = _trackertaskservice;
        }

        [HttpGet("GetTaskbyID/{id}")]
        public async Task<ActionResult<TblTaskList>> Get(int id)
        {
            try
            {
                TaskList model = new TaskList();
                var result = await TaskListService.Get(id);

                model = Mapper.Map<TblTaskList, TaskList>(result);

                model.etaHH = Convert.ToString(Convert.ToInt32(result.EtaTime / 60));
                model.etaMM = Convert.ToString(result.EtaTime - (Convert.ToInt32(result.EtaTime / 60) * 60));

                if (result != null)
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
        [HttpGet("gettasklistforuser")]
        public async Task<ActionResult<GetTaskListForUser_Result>> GetTaskListForUser(int EmpID, string status)
        {
            try
            {
                var result = await TaskListService.GetTaskListForUser(EmpID, status);


                if (result != null)
                {
                    return Ok(result);
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


        // start toptracker task list with Pegination
        //[HttpGet("gettasklistforuserwithpegination")]
        //public async Task<ActionResult<IEnumerable<GetTaskListForUser_Result>>> GetTaskListForUserPegination(int EmpID, string status = "P", int pageNumber = 1, int pageSize = 10)
        //{
        //    try
        //    {
        //        var result = await TaskListService.GetTaskListForUserPegination(EmpID, status, pageNumber, pageSize);

        //        if (result != null && result.Any())
        //        {
        //            return Ok(result);
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
        //#withCount

        [HttpGet("gettasklistforuserwithpegination")]
        public async Task<IActionResult> GetTaskListForUserPegination(int EmpID, string status = "P", int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                //// ✅ Add FIX 3 here
                //if (pageNumber < 1) pageNumber = 1;
                //if (pageSize < 1) pageSize = 10;
                var countResult = await TaskListService.GetTaskCountListForUserPegination(EmpID, status)
                as List<GetTaskCountListForUserwithPegination_Results>;

                //            var countResult = (await TaskListService
                //.GetTaskCountListForUserPegination(EmpID, status))
                //?.ToList();

                int totalCount = countResult?.FirstOrDefault()?.TotalCount ?? 0;

                var result = await TaskListService.GetTaskListForUserPegination(EmpID, status, pageNumber, pageSize)
                             as List<GetTaskListForUserwithPegination_Results>;

                if (result != null && result.Any())
                {
                    // Construct pagination metadata (optional)
                    var paginationMetadata = new
                    {
                        totalCount,
                        pageSize,
                        currentPage = pageNumber,
                        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    };

                    //Response.Headers.Add("x-pagination", JsonConvert.SerializeObject(paginationMetadata));
                    //return Ok(result);
                    return Ok(new
                    {
                        data = result,
                        totalCount = totalCount,
                        pageSize = pageSize,
                        currentPage = pageNumber,
                        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    });

                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return StatusCode(500, ex.Message);  // 500 = Internal Server Error
            }

        }




        // end toptracker task list with Pegination



        [HttpGet("gettasklistforuserpendinglist/{EmpID}")]
        public async Task<ActionResult<GetTaskListForUserPendingList_Result>> GetTaskListForUserPandingList(int EmpID)
        {
            try
            {
                var result = await TaskListService.GetTaskListForUserPendingList(EmpID);


                if (result != null)
                {
                    return Ok(result);
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


        //[HttpPost("AddorEditTaskList")]
        //public async Task<ActionResult<AccountCategory>> AddEditTaskList(TaskList model)
        //{
        //    try
        //    {
        //        bool isResult = false;
        //        TblTaskList obj = Mapper.Map<TaskList, TblTaskList>(model);

        //        if (obj.Id != 0)
        //        {
        //            //obj.CreatedTime = DateTime.Now;
        //            obj.UpdatedTime = DateTime.Now;
        //            isResult = await TaskListService.tblupdate(obj);
        //        }
        //        else
        //        {
        //            obj.CreatedTime = DateTime.Now;
        //            obj.UpdatedTime = DateTime.Now;
        //            isResult = await TaskListService.tblinsert(obj);
        //        }
        //        if (isResult)
        //        {
        //            return Ok();
        //        }
        //        else
        //        {
        //            return BadRequest();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError($"Error - : {ex}");
        //    }
        //    return BadRequest();
        //}

        [HttpPost("AddorEditTaskList")]
        public async Task<ActionResult<AccountCategory>> AddEditTaskList(TaskList model)
        {
            try
            {
                bool isResult = false;
                TblTaskList obj = Mapper.Map<TaskList, TblTaskList>(model);

                if (obj.Id != 0)
                {
                    //obj.CreatedTime = DateTime.Now;
                    obj.UpdatedTime = DateTime.Now;
                    isResult = await TaskListService.tblupdate(obj);
                }
                else
                {
                    obj.CreatedTime = DateTime.Now;
                    obj.UpdatedTime = DateTime.Now;
                    isResult = await TaskListService.tblinsert(obj);
                    // Soft-coded: If IsRecurrent is true, create tasks 
                    if (model.IsRecurrent && obj.AssignDate.HasValue && obj.Eta.HasValue)
                    {
                        int totalDays = (obj.Eta.Value.Date - obj.AssignDate.Value.Date).Days;

                        if (totalDays > 0)
                        {
                            for (int i = 1; i <= totalDays; i++)  // includes the last day
                            {
                                TblTaskList repeatTask = new TblTaskList
                                {
                                    PointPerson = obj.PointPerson,
                                    SecondPerson = obj.SecondPerson,
                                    AccountablePerson = obj.AccountablePerson,
                                    Project = obj.Project,
                                    Subproject = obj.Subproject,
                                    SubProjectCategory = obj.SubProjectCategory,
                                    Subject = obj.Subject,
                                    Task = obj.Task,
                                    Completed = obj.Completed,
                                    AssignDate = obj.AssignDate.Value.AddDays(i),
                                    Eta = obj.AssignDate.Value.AddDays(i), // or obj.Eta.Value.Date.AddDays(i - totalDays) if you want to keep relative time
                                    EtaTime = obj.EtaTime,
                                    ActualTime = 0,
                                    CreatedTime = DateTime.Now,
                                    UpdatedTime = DateTime.Now,
                                    IsRecurrent = true
                                };

                                await TaskListService.tblinsert(repeatTask);
                            }
                        }
                    }


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


        [HttpPost("addEditTrackerTask")]
        public async Task<ActionResult<AccountCategory>> AddEditTrackerTask(int id, string button)
        {
            try
            {
                bool Result = false;
                IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                TblTaskList data = await TaskListService.Get(id);
                UtilizationTrackerModel model = new UtilizationTrackerModel();
                model.StartTime = datetimenowList[0].ServerTime;
                model.Updateddate = datetimenowList[0].ServerTime;
                model.ProjectId = data.Project ?? 0;
                model.SubProjectId = data.Subproject ?? 0;
                model.SubProjectCategoryId = data.SubProjectCategory ?? 0;
                model.Activity = data.Task;
                model.TaskListid = id;
                TblToptrackerTask trackertask = Mapper.Map<TblToptrackerTask>(model);
                if (button == "start")
                {
                    Result = await trackertaskservice.tblinsert(trackertask);

                    if (Result)
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    IEnumerable<GetTopTrackerTaskEntrywithtasklistid_Result> offset = await trackertaskservice.GetTopTrackerTaskEntrywithtasklistid(model.Employeeid, id);
                    List<GetTopTrackerTaskEntrywithtasklistid_Result> asList = offset.ToList();
                    if (asList.Count > 0)
                    {
                        TblToptrackerTask trackertask1 = await trackertaskservice.Get(asList[0].ID);
                        trackertask1.EndTime = datetimenowList[0].ServerTime;
                        trackertask1.UpdatedDate = datetimenowList[0].ServerTime;
                        TimeSpan ts = (trackertask1.StartTime - trackertask1.EndTime) ?? TimeSpan.Zero;
                        trackertask1.Duration = ts.ToString(@"hh\:mm\:ss");
                        Result = await trackertaskservice.tblupdate(trackertask1);
                        if (Result)
                        {
                            return Ok();
                        }
                        else
                        {
                            return BadRequest();
                        }
                    }
                    if (Result)
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : {ex}");
            }
            return BadRequest();
        }

        [HttpGet("GetTaskListDetail")]
        public async Task<ActionResult<GetTaskListDetail_Result>> GetTaskListDetail()
        {
            try
            {
                var result = await TaskListService.GetTaskListDetail();


                if (result != null)
                {
                    return Ok(result);
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
        [HttpGet("GetEmployerName")]
        public async Task<ActionResult<GetEmployerName_Result>> GetEmployerName()
        {
            try
            {
                var result = await TaskListService.GetEmployerName();
                if (result != null)
                {
                    List<GetEmployerName_Result> results = new List<GetEmployerName_Result>();
                    results.Add(new GetEmployerName_Result { ID = 0, Name= "--Select--" });
                    results.AddRange(result.Select(d => new GetEmployerName_Result { Name= d.Name, ID = d.ID }).ToList());
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
        [HttpDelete("DeleteTask/{id:int}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            try
            {
                var result = await TaskListService.tbldelete(id);
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
    }
}