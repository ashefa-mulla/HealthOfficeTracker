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
using BusinessService.Custom.Common;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Net.Http.Headers;
using System.IO;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    public class CommonController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<CommonController> Logger;
        private readonly ICommonService _commonService;
        public CommonController(IMapper _mapper, ILogger<CommonController> _logger, IUserService _userServices, ICommonService commonService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _commonService = commonService;

        }

        [HttpGet("GetCountries")]
        public async Task<ActionResult<GetCountries_Result>> GetCountries()
        {
            try
            {
                var result = await _commonService.GetCountries();

                if (result != null)
                {
                    List<GetCountries_Result> results = new List<GetCountries_Result>();
                    results.Add(new GetCountries_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetCountries_Result { Name = d.Name, ID = d.ID }).ToList());
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

        [HttpGet("GetDesignation")]
        public async Task<ActionResult<GetDesignation_Result>> GetDesignation()
        {
            try
            {
                var result = await _commonService.GetDesignation();

                if (result != null)
                {
                    List<GetDesignation_Result> results = new List<GetDesignation_Result>();
                    results.Add(new GetDesignation_Result { ID = 0,Name="--Select--"});
                    results.AddRange(result.Select(d => new GetDesignation_Result { Name = d.Name, ID = d.ID }).ToList());
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

        [HttpGet("GetStates/{coutnryID}")]
        public async Task<ActionResult<GetStates_Result>> GetStates(int coutnryID)
        {
            try
            {
                var result = await _commonService.GetStates(coutnryID);

                if (result != null)
                {
                    List<GetStates_Result> results = new List<GetStates_Result>();
                    results.Add(new GetStates_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetStates_Result { Name = d.Name, ID = d.ID }).ToList());
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

        [HttpGet("GetCities/{stateid}")]
        public async Task<ActionResult<GetCities_Result>> GetCities(int stateid)
        {
            try
            {
                var result = await _commonService.GetCities(stateid);

                if (result != null)
                {
                    List<GetCities_Result> results = new List<GetCities_Result>();
                    results.Add(new GetCities_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetCities_Result { Name = d.Name, ID = d.ID }).ToList());
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

        [HttpGet("GetTimeZone")]
        public async Task<ActionResult<TblTimezone>> GetTimeZone()
        {
            try
            {
                var result = await _commonService.GetTimeZoneList();

                if (result != null)
                {
                    List<TblTimezone> results = new List<TblTimezone>();
                    results.Add(new TblTimezone { Id = 0, NameOfTimeZone = "--Select--" });
                    results.AddRange(result.Select(d => new TblTimezone { NameOfTimeZone = d.NameOfTimeZone, Id = d.Id }).ToList());
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

        [HttpGet("GetCompanyBranch/{comapnyid}")]
        public async Task<ActionResult<GetCompanyBranchListByCompanyID_Result>> GetCompanyBranch(int comapnyid)
        {
            try
            {
                var result = await _commonService.GetCompanyBranchListByCompanyID(comapnyid);

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

        [HttpGet("GetUserTypes")]
        public async Task<ActionResult<TblUserType>> GetUserTypes()
        {
            try
            {
                var result = await _commonService.GetUserTypes();

                if (result != null)
                {
                    List<TblUserType> results = new List<TblUserType>();
                    results.Add(new TblUserType { Id = 0, Type = "--Select--" });
                    results.AddRange(result.Select(d => new TblUserType { Type = d.Type, Id = d.Id }).ToList());
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

        [HttpPost("uploadstatic"), DisableRequestSizeLimit]
        public IActionResult UploadStatic()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("FileServer", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                Guid newfilename = Guid.NewGuid();
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var ext = Path.GetExtension(file.FileName);
                    var fname = newfilename + ext;
                    var fullPath = Path.Combine(pathToSave, fname); //fileName
                    var dbPath = Path.Combine(folderName, fname);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }

        }

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult Upload(string foldername)
        {
            try
            {

                var file = Request.Form.Files[0];
                var folderName = Path.Combine("FileServer", foldername);
                //Images
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName).Replace("/", "\\");

                Guid newfilename = Guid.NewGuid();
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var ext = Path.GetExtension(file.FileName);
                    var fname = newfilename + ext;
                    var fullPath = Path.Combine(pathToSave, fname).Replace("/", "\\"); //fileName

                    var dbPath = Path.Combine(folderName, fname).Replace("/", "\\");
                    bool dir = System.IO.Directory.Exists(pathToSave);
                    if (!dir)
                    {
                        System.IO.Directory.CreateDirectory(pathToSave);
                    }
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }

        }


        //08-15 2024

        [HttpGet("years")]
        public async Task<ActionResult<sp_getyear>> GetYears()
        {
            try
            {
                var result = await _commonService.GetYears();

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


        [HttpGet("months")]
        public async Task<ActionResult<sp_getmonth>> GetMonths()
        {
            try
            {
                var result = await _commonService.GetMonts();

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


    }
}