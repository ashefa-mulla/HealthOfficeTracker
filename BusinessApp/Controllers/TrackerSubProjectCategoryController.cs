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
using BusinessService.Custom.TrackerSubProjectCategory;
using BusinessService.Custom.TrackerSubProject;
using BusinessService.Custom.TrackerProject;
using AutoMapper;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class TrackerSubProjectCategoryController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerSubProjectCategoryController> Logger;
        private readonly ITrackerSubProjectCategoryService _trackerSubProjectCategoryService;
        private readonly ITrackerSubProjectService _TrackersubprojectService;
        private readonly ITrackerProjectService _TrackerProjectService;
        public TrackerSubProjectCategoryController(ITrackerProjectService TrackerProjectService, IMapper _mapper, ILogger<TrackerSubProjectCategoryController> _logger, IUserService _userServices, ITrackerSubProjectCategoryService trackerSubProjectCategoryService, ITrackerSubProjectService TrackerSubProjectService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _trackerSubProjectCategoryService = trackerSubProjectCategoryService;
            _TrackersubprojectService = TrackerSubProjectService;
            _TrackerProjectService = TrackerProjectService;

        }
        [HttpGet("GetTrackerSubProjectCategorybyID/{id}")]
        public async Task<ActionResult<TrackerSubProjectCategoryModel>> Get(int id)
        {
            try
            {
                TrackerSubProjectCategoryModel model = new TrackerSubProjectCategoryModel();
                var result = await _trackerSubProjectCategoryService.Get(id);

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
        [HttpGet("GetTrackerSubProjectCategoryList")]
        public async Task<ActionResult<GetTrackerSubProjectcategory_Result>> GetTrackerSubProjectcategoryList()
        {
            try
            {
                var result = await _trackerSubProjectCategoryService.GetTrackerSubProjectcategory();

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

        [HttpGet("GetTrackerSubProjectcategoryWithProjectList")]
        public async Task<ActionResult<GetTrackerSubProjectcategoryWithProject_Result>> GetTrackerSubProjectcategoryWithProject()
        {
            try
            {
                var result = await _trackerSubProjectCategoryService.GetTrackerSubProjectcategoryWithProject();

                if (result != null)
                {
                    //List<GetTrackerSubProjectcategoryWithProject_Result> results = new List<GetTrackerSubProjectcategoryWithProject_Result>();
                    //results.Add(new GetTrackerSubProjectcategoryWithProject_Result { ID = 0, Name = "--Select--" });
                    //results.AddRange(result.Select(d => new GetTrackerSubProjectcategoryWithProject_Result { Name = d., ID = d.Id }).ToList());
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
        
        [HttpPost("addeditSubProjectCategory")]
        public async Task<ActionResult<TrackerSubProjectCategoryModel>> AddEditSubProjectCategory(TrackerSubProjectCategoryModel model)
        {
            try
            {
                bool isResult = false;
                TblTrackerSubProjectCategory obj = Mapper.Map<TrackerSubProjectCategoryModel, TblTrackerSubProjectCategory>(model);
                if (obj.Id != 0)
                {
                    isResult = await _trackerSubProjectCategoryService.tblupdate(obj);
                }
                else
                {
                    obj.BranchId = 1;
                    isResult = await _trackerSubProjectCategoryService.tblinsert(obj);
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
        [HttpDelete("deleteSubProjectCategory/{id:int}")]
        public async Task<ActionResult> DeleteTrackerProjectCategory(int id)
        {
            try
            {
                var result = await _trackerSubProjectCategoryService.tbldelete(id);
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
        [HttpGet("GetTrackerProject")]
        public async Task<ActionResult<TblTrackerSubProject>> GetTrackerProject(int companyid, int branchid, int adminId)
        {
            try
            {
                var result = await _TrackerProjectService.GetTrackerProjectList(companyid, branchid, adminId);
                if (result != null)
                {
                    List<TblTrackerProject> results = new List<TblTrackerProject>();
                    results.Add(new TblTrackerProject { Id = 0, Project = "--Select--" });
                    results.AddRange(result.Select(d => new TblTrackerProject { Project = d.Project, Id = d.Id }).ToList());
                    return Ok(results);
                }
                else
                    return NotFound(result);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }
        [HttpGet("GetTrackerSubProjectList/{projectid}")]
        public async Task<ActionResult<TblTrackerSubProject>> GetTrackerSubProjectList(int projectid)
        {
            try
            {
                var result = await _TrackersubprojectService.GetTrackerSubProjectList(projectid);

                if (result != null)
                { 
                List<TblTrackerSubProject> results = new List<TblTrackerSubProject>();
                results.Add(new TblTrackerSubProject { Id = 0, Subcategory = "--Select--" });
                results.AddRange(result.Select(d => new TblTrackerSubProject { Subcategory = d.Subcategory, Id = d.Id }).ToList());
                return Ok(results);
                }
                else
                    return NotFound(result);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }

        }
    }
}
