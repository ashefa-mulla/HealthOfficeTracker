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
using BusinessService.Custom.UtilizationTracker;
using BusinessService.Custom.Employee;
using BusinessService.Custom.TrackerSubProject;
using BusinessService.Custom.TrackerSubProjectCategory;
using BusinessService.Custom.PunchDetail;
using AutoMapper;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskActivityController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        public readonly IEmployeeService _EmployeeService;
        private readonly IUtilizationTrackerService _UtilizationTrackerService;
        public readonly IPunchDetailService _PunchDetailservice;
        public TaskActivityController(IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices,IUtilizationTrackerService UtilizationTrackerService
           , IEmployeeService EmployeeService, ITrackerSubProjectService trackerSubProjectService, ITrackerSubProjectCategoryService TrackerSubProjectCategoryService, IPunchDetailService PunchDetailservice)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _UtilizationTrackerService = UtilizationTrackerService;
            _EmployeeService = EmployeeService;
            _PunchDetailservice = PunchDetailservice;

        }

        [HttpGet("GetActivitylog")]   //Girish - 01202022
        public async Task<ActionResult<GetActiveLogOfEmployee_Result>> GetActivitylog(string fromdate, string todate, int empid, int uid = 3)
        {
            try
            {
                DateTime ld_stdt = Convert.ToDateTime(fromdate);
                DateTime ld_enddt = Convert.ToDateTime(todate);
                var result = await _UtilizationTrackerService.GetActiveLogOfEmployee(ld_stdt, ld_enddt, empid,uid);
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

        [HttpGet("GetActivityData")]
        public async Task<ActionResult<GetActiveLogOfEmployee_Result>> GetActivityData(string fromdate, string todate,int empid, int uid = 3)
        {
            try
            {
                DateTime ld_stdt = Convert.ToDateTime(fromdate);
                DateTime ld_enddt = Convert.ToDateTime(todate);
                var result = await _UtilizationTrackerService.GetActiveLogOfEmployee(ld_stdt, ld_enddt, empid,uid);
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
        [HttpGet("GetTrackerTask/{id}")]
        public async Task<ActionResult<UtilizationTrackerModel>> Get(int id)
        {
            try
            {
                UtilizationTrackerModel model = new UtilizationTrackerModel();
                var result = await _UtilizationTrackerService.Get(id);

                if (result != null)
                    return Ok(result);
                else
                    return Ok(model);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }

        [HttpPost("addeditBankMaster")]
        public async Task<ActionResult<UtilizationTrackerModel>> AddEditbankMaster(UtilizationTrackerModel model)
        {
            try
            {
                bool isResult = false;
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
    }
}