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
using BusinessService.Custom.TrackerSubProject;

using AutoMapper;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class TrackerSubProjectController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerSubProjectController> Logger;
        private readonly ITrackerSubProjectService _TrackersubprojectService;
        public TrackerSubProjectController(IMapper _mapper, ILogger<TrackerSubProjectController> _logger, IUserService _userServices, ITrackerSubProjectService TrackerSubProjectService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _TrackersubprojectService = TrackerSubProjectService;

        }
        [HttpGet("GetTrackerSubProject/{id}")]
        public async Task<ActionResult<TrackerSubProjectModel>> Get(int id)
        {
            try
            {
                TrackerSubProjectModel model = new TrackerSubProjectModel();
                var result = await _TrackersubprojectService.Get(id);

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
        //99
        [HttpGet("GetTrackerSubProjectList")]
        public async Task<ActionResult<GetPurchaseOrderRefDocList_Result>> GetTrackerSubProjectList()
        {
            try
            {
                var result = await _TrackersubprojectService.GetTrackerSubProject();

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

        [HttpGet("GetTrackerSubProject/{projectid:int}")]
        public async Task<ActionResult<TrackerSubProjectModel>> GetTrackerSubProjectList(int projectid)
        {
            try
            {
                var result = await _TrackersubprojectService.Get(projectid);

                if (result != null)
                    return Ok(result);
                else
                    return NotFound(result);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }

        [HttpGet("GetProjectCategoryList")]
        public async Task<ActionResult<TblProjectCategory>> GetProjectCategoryList()
        {
            try
            {
                var result = await _TrackersubprojectService.GetProjectCategoryList();

                if (result != null)
                {
                    List<GetCountries_Result> results = new List<GetCountries_Result>();
                    results.Add(new GetCountries_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetCountries_Result { Name = d.Category, ID = d.Id }).ToList());
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
        [HttpGet("GetCompanies")]
        public async Task<ActionResult<GetCompanies_Result>> GetCompanies()
        {
            try
            {
                var result = await _TrackersubprojectService.GetCompanies();

                if (result != null)
                {
                    List<GetCountries_Result> results = new List<GetCountries_Result>();
                    results.Add(new GetCountries_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetCountries_Result { Name = d.Company_Name, ID = d.Id }).ToList());
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

        [HttpGet("GetProjects")]
        public async Task<ActionResult<GetProjectsList_Result>> GetProjectsList()
        {
            try
            {
                var result = await _TrackersubprojectService.GetProjectsList();

                if (result != null)
                {
                    List<GetProjectsList_Result> results = new List<GetProjectsList_Result>();
                    results.Add(new GetProjectsList_Result { Id = 0, Project = "--Select--" });
                    results.AddRange(result.Select(d => new GetProjectsList_Result { Project = d.Project, Id = d.Id }).ToList());
                    return Ok(results.Where(x=>x.Project != null));
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
        [HttpPost("addeditSubProject")]
        public async Task<ActionResult<TrackerSubProjectModel>> AddEditSubProject(TrackerSubProjectModel model)
        {
            try
            {
                bool isResult = false;
                TblTrackerSubProject obj = Mapper.Map<TrackerSubProjectModel, TblTrackerSubProject>(model);
                if (obj.Id != 0)
                {
                    isResult = await _TrackersubprojectService.tblupdate(obj);
                }
                else
                {
                    obj.BranchId = 1;
                    isResult = await _TrackersubprojectService.tblinsert(obj);
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
        [HttpDelete("deleteSubProject/{id:int}")]
        public async Task<ActionResult> DeleteTrackerProject(int id)
        {
            try
            {
                var result = await _TrackersubprojectService.tbldelete(id);
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
