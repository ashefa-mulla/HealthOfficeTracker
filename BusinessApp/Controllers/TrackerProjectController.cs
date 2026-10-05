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

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class TrackerProjectController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        private readonly ITrackerProjectService _TrackerProjectService;
        public TrackerProjectController(IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, ITrackerProjectService TrackerProjectService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _TrackerProjectService = TrackerProjectService;

        }
        [HttpGet("GetTrackerProject/{id}")]
        public async Task<ActionResult<TrackerProjectModel>> Get(int id)
        {
            try
            {
                TrackerProjectModel model = new TrackerProjectModel();
                var result = await _TrackerProjectService.Get(id);

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

        [HttpGet("GetAllTrackerProject")]
        public async Task<ActionResult<GetTrackerProject_Result>> GetAllTrackerProject()
        {
            try
            {
                var result = await _TrackerProjectService.GetAllTrackerProject();

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
        [HttpPost("addeditTrackerProject")]
        public async Task<ActionResult<TrackerProjectModel>> AddEditTrackerProject(TrackerProjectModel model)
        {
            try
            {
                bool isResult = false;
                TblTrackerProject obj = Mapper.Map<TrackerProjectModel, TblTrackerProject>(model);
                if (obj.Id != 0)
                {
                    isResult = await _TrackerProjectService.tblupdate(obj);
                }
                else
                {
                    obj.BranchId = 1;
                    isResult = await _TrackerProjectService.tblinsert(obj);
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
        [HttpDelete("deleteTrackerProject/{id:int}")]
        public async Task<ActionResult> DeleteTrackerProject(int id)
        {
            try
            {
                var result = await _TrackerProjectService.tbldelete(id);
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

        [HttpGet("GetCompanies")]
        public async Task<ActionResult<GetCompanies_Result>> GetCompanies()
        {
            try
            {
                var result = await _TrackerProjectService.GetCompanies();

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

    }
}
