using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BusinessApp.Models;
using BusinessData.DataContext;
using BusinessService.Custom.EmployeeMonthlyAllowance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [Route("[controller]")]
    [ApiController]
    public class EmployeeMonthlyAllowanceController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IEmployeeMonthlyAllowanceService _monthlyAllowanceService;
        private readonly ILogger<EmployeeMonthlyAllowanceController> Logger;

        public EmployeeMonthlyAllowanceController(
            IMapper mapper,
            ILogger<EmployeeMonthlyAllowanceController> logger,
            IEmployeeMonthlyAllowanceService monthlyAllowanceService)
        {
            Mapper = mapper;
            Logger = logger;
            _monthlyAllowanceService = monthlyAllowanceService;
        }

        /// <summary>
        /// Get all active allowances from Tbl_AllowanceMaster where IsMonthlyAllowance is true
        /// </summary>
        [HttpGet("GetMonthlyAllowanceMasterList")]
        public async Task<ActionResult<IEnumerable<AllowanceMasterModel>>> GetMonthlyAllowanceMasterList()
        {
            try
            {
                var result = await _monthlyAllowanceService.GetMonthlyAllowanceMasterList();
                var models = Mapper.Map<IEnumerable<TblAllowanceMaster>, IEnumerable<AllowanceMasterModel>>(result);
                return Ok(models);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetMonthlyAllowanceMasterList: {ex}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Get a single monthly allowance by primary key ID
        /// </summary>
        [HttpGet("GetMonthlyAllowance/{id:long}")]
        public async Task<ActionResult<EmployeeMonthlyAllowanceModel>> GetMonthlyAllowance(long id)
        {
            try
            {
                var result = await _monthlyAllowanceService.Get(id);
                if (result != null)
                {
                    var model = Mapper.Map<TblEmployeeMonthlyAllowance, EmployeeMonthlyAllowanceModel>(result);
                    return Ok(model);
                }
                return NotFound(new { Message = $"Monthly allowance with ID {id} not found." });
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetMonthlyAllowance: {ex}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Get monthly allowances filtered by empId, month, year, allowanceId
        /// </summary>
        [HttpGet("GetMonthlyAllowances")]
        public async Task<ActionResult<IEnumerable<EmployeeMonthlyAllowanceModel>>> GetMonthlyAllowances(
            [FromQuery] int? empId = null,
            [FromQuery] int? month = null,
            [FromQuery] int? year = null,
            [FromQuery] long? allowanceId = null,
            [FromQuery] bool? isActive = true)
        {
            try
            {
                var result = await _monthlyAllowanceService.GetAll(empId, month, year, allowanceId, isActive);
                var models = Mapper.Map<IEnumerable<TblEmployeeMonthlyAllowance>, IEnumerable<EmployeeMonthlyAllowanceModel>>(result);
                return Ok(models);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetMonthlyAllowances: {ex}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Get monthly allowances for a specific employee
       /// </summary>
        [HttpGet("GetMonthlyAllowancesByEmpId/{empId:int}")]
        public async Task<IActionResult> GetMonthlyAllowancesByEmpId(
            int? empId = null,
            [FromQuery] int? month = null,
            [FromQuery] int? year = null)
        {
            try
            {
                int targetEmpId = empId ?? 0;
                if (targetEmpId <= 0)
                {
                    return BadRequest(new { Message = "Employee ID is required." });
                }

                int targetMonth = (month.HasValue && month.Value > 0) ? month.Value : DateTime.Now.Month;
                int targetYear = (year.HasValue && year.Value > 0) ? year.Value : DateTime.Now.Year;

                var result = await _monthlyAllowanceService.GetEmployeeMonthlyAllowance(targetEmpId, targetMonth, targetYear);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetMonthlyAllowancesByEmpId: {ex}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Insert or update an employee monthly allowance
        /// </summary>
        [HttpPost("AddEditMonthlyAllowance")]
        public async Task<ActionResult> AddEditMonthlyAllowance([FromBody] EmployeeMonthlyAllowanceModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(new { Message = "Invalid monthly allowance data." });
                }

                if (model.EmpId <= 0)
                {
                    return BadRequest(new { Message = "Employee ID is required." });
                }

                if (model.AllowanceId <= 0)
                {
                    return BadRequest(new { Message = "Allowance ID is required." });
                }

                if (model.Month < 1 || model.Month > 12)
                {
                    return BadRequest(new { Message = "Month must be between 1 and 12." });
                }

                if (model.Year < 2000 || model.Year > 2100)
                {
                    return BadRequest(new { Message = "Valid Year is required." });
                }

                var entity = Mapper.Map<EmployeeMonthlyAllowanceModel, TblEmployeeMonthlyAllowance>(model);
                bool isSuccess = await _monthlyAllowanceService.AddOrUpdateMonthlyAllowance(entity);

                if (isSuccess)
                {
                    var updated = await _monthlyAllowanceService.Get(entity.Id);
                    var returnModel = Mapper.Map<TblEmployeeMonthlyAllowance, EmployeeMonthlyAllowanceModel>(updated ?? entity);

                    return Ok(new
                    {
                        Success = true,
                        Message = "Employee Monthly Allowance saved successfully.",
                        Data = returnModel
                    });
                }
                else
                {
                    return BadRequest(new { Success = false, Message = "Failed to save Employee Monthly Allowance." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error saving Employee Monthly Allowance: {ex}");
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        
        /// <summary>
        /// Delete an employee monthly allowance by ID
        /// </summary>
        [HttpDelete("DeleteMonthlyAllowance/{id:long}")]
        public async Task<ActionResult> DeleteMonthlyAllowance(long id)
        {
            try
            {
                bool isSuccess = await _monthlyAllowanceService.tbldelete(id);
                if (isSuccess)
                {
                    return Ok(new { Success = true, Message = "Employee Monthly Allowance deleted successfully." });
                }
                else
                {
                    return NotFound(new { Success = false, Message = $"Employee Monthly Allowance with ID {id} not found or could not be deleted." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error deleting Employee Monthly Allowance: {ex}");
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
