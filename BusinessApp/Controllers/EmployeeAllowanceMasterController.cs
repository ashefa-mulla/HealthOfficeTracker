using AutoMapper;
using BusinessApp.Models;
using BusinessApp.Utilities;
using BusinessData.DataContext;
using BusinessService.Common;
using BusinessService.Custom.Employee;
using BusinessService.Custom.EmployeeAllowanceMaster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeAllowanceMasterController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IEmployeeAllowanceMasterService _employeeallowancemasterservice;
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeeAttendanceController> Logger;

        public EmployeeAllowanceMasterController(
            IMapper mapper,
            ILogger<EmployeeAttendanceController> logger,
            IEmployeeAllowanceMasterService employeeallowancemasterservice,
            IEmployeeService employeeService)
        {
            Mapper = mapper;
            Logger = logger;
            _employeeallowancemasterservice = employeeallowancemasterservice;
            _employeeService = employeeService;
        }
        // GET: api/EmployeeAllowanceMaster/GetAllowanceMasterList
        [HttpGet("GetAllowanceMasterList")]
        public async Task<IActionResult> GetAllowanceMasterList(
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var result = await _employeeallowancemasterservice.GetAll(isActive);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error loading allowance master list");
                return StatusCode(500, "Unable to load allowances.");
            }
        }

        // GET: api/EmployeeAllowanceMaster/GetAllowanceMaster/5
        [HttpGet("GetAllowanceMaster/{id:long}")]
        public async Task<IActionResult> GetAllowanceMaster(long id)
        {
            try
            {
                var result = await _employeeallowancemasterservice.Get(id);

                if (result == null)
                    return NotFound("Allowance not found.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error loading allowance {Id}", id);
                return StatusCode(500, "Unable to load allowance.");
            }
        }

        // GET: api/EmployeeAllowanceMaster/GetAllowanceTypes
        [HttpGet("GetAllowanceTypes")]
        public IActionResult GetAllowanceTypes()
        {
            return Ok(new[]
            {
                new { Value = "E", Text = "Earning" },
                new { Value = "D", Text = "Deduction" }
            });
        }

        // POST: api/EmployeeAllowanceMaster/addeditAllowanceMaster
        [HttpPost("addeditAllowanceMaster")]
        public async Task<IActionResult> AddEditAllowanceMaster(
            [FromBody] AllowanceMasterModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest("Invalid request.");

                if (string.IsNullOrWhiteSpace(model.AllowanceName))
                    return BadRequest("Allowance name is required.");

                if (string.IsNullOrWhiteSpace(model.AllowanceCode))
                    return BadRequest("Allowance code is required.");

                if (model.AllowanceType != "E" &&
                    model.AllowanceType != "D")
                    return BadRequest("Allowance type must be E or D.");

                if (await _employeeallowancemasterservice.IsCodeTaken(
                    model.AllowanceCode.Trim(), model.Id))
                {
                    return Conflict("Allowance code already exists.");
                }

                bool result;

                if (model.Id > 0)
                {
                    var existing = await _employeeallowancemasterservice.Get(model.Id);

                    if (existing == null)
                        return NotFound("Allowance not found.");

                    existing.AllowanceName = model.AllowanceName.Trim();
                    existing.AllowanceCode = model.AllowanceCode.Trim();
                    existing.AllowanceType = model.AllowanceType;
                    existing.Description = model.Description;

                    // Set UpdatedBy using the authenticated user.
                    result = await _employeeallowancemasterservice.tblupdate(existing);
                }
                else
                {
                    var entity = Mapper.Map<
                        AllowanceMasterModel,
                        TblAllowanceMaster>(model);

                    entity.Id = 0;
                    entity.AllowanceName = model.AllowanceName.Trim();
                    entity.AllowanceCode = model.AllowanceCode.Trim();

                    // Set CreatedBy using the authenticated user.
                    result = await _employeeallowancemasterservice.tblinsert(entity);
                }

                if (!result)
                    return StatusCode(500, "Unable to save allowance.");

                return Ok(new
                {
                    success = true,
                    message = "Allowance saved successfully."
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error saving allowance");
                return StatusCode(500, "Unable to save allowance.");
            }
        }

        // DELETE: api/EmployeeAllowanceMaster/DeActivateAllowanceMaster/5
        [HttpDelete("DeActivateAllowanceMaster/{id:long}")]
        public async Task<IActionResult> DeActivateAllowanceMaster(long id)
        {
            try
            {
                var existing = await _employeeallowancemasterservice.Get(id);

                if (existing == null)
                    return NotFound("Allowance not found.");

                // tbldelete must perform SOFT DELETE.
                var result = await _employeeallowancemasterservice.tbldelete(id);

                if (!result)
                    return StatusCode(500, "Unable to deactivate allowance.");

                return Ok(new
                {
                    success = true,
                    message = "Allowance deactivated successfully."
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error deactivating allowance {Id}", id);
                return StatusCode(500, "Unable to deactivate allowance.");
            }
        }

    }
}
