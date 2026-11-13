using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BusinessApp.Models;
using BusinessData.DataContext;
using BusinessService.Custom.EmployeeSalaryRevision;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeSalaryRevisionController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IEmployeeSalaryRevisionService _salaryRevisionService;
        private readonly ILogger<EmployeeSalaryRevisionController> Logger;

        public EmployeeSalaryRevisionController(
            IMapper mapper,
            ILogger<EmployeeSalaryRevisionController> logger,
            IEmployeeSalaryRevisionService salaryRevisionService)
        {
            Mapper = mapper;
            Logger = logger;
            _salaryRevisionService = salaryRevisionService;
        }

        [HttpGet("GetSalaryRevision/{id:long}")]
        public async Task<ActionResult<EmployeeSalaryRevisionModel>> Get(long id)
        {
            try
            {
                var result = await _salaryRevisionService.Get(id);
                if (result != null)
                {
                    var model = Mapper.Map<TblEmployeeSalaryRevision, EmployeeSalaryRevisionModel>(result);
                    return Ok(model);
                }
                else
                {
                    return Ok(new EmployeeSalaryRevisionModel());
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetSalaryRevision: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetSalaryRevisionsByEmpId/{empId:int}")]
        public async Task<IActionResult> GetSalaryRevisionsByEmpId(
            int empId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 100,
            [FromQuery] string search = null)
        {
            try
            {
                int? employeeId = empId > 0 ? empId : null;
                var countResult = await _salaryRevisionService.GetSalaryRevisionRecords(employeeId, search);
                int totalCount = countResult?.FirstOrDefault()?.TotalRows ?? 0;

                var result = await _salaryRevisionService.GetSalaryRevisionList(employeeId, pageNumber, pageSize, search);

                if (result != null && result.Any())
                {
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
                    return Ok(new
                    {
                        data = new List<spa_getemployeesalaryrevision_Result>(),
                        totalCount = 0,
                        pageSize = pageSize,
                        currentPage = pageNumber,
                        totalPages = 0
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetSalaryRevisionsByEmpId: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetActiveSalaryRevision/{empId:int}")]
        public async Task<ActionResult<EmployeeSalaryRevisionModel>> GetActiveSalaryRevision(int empId)
        {
            try
            {
                var result = await _salaryRevisionService.GetActiveSalaryRevision(empId);
                if (result != null)
                {
                    var model = Mapper.Map<TblEmployeeSalaryRevision, EmployeeSalaryRevisionModel>(result);
                    return Ok(model);
                }
                else
                {
                    return Ok(new EmployeeSalaryRevisionModel());
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetActiveSalaryRevision: {ex}");
                return BadRequest();
            }
        }


        [HttpPost("AddEditSalaryRevision")]
        public async Task<ActionResult> AddEditSalaryRevision([FromBody] EmployeeSalaryRevisionModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(new { Message = "Invalid salary revision data." });
                }

                TblEmployeeSalaryRevision obj = Mapper.Map<EmployeeSalaryRevisionModel, TblEmployeeSalaryRevision>(model);

                bool isResult = await _salaryRevisionService.AddOrUpdateSalaryRevision(obj);

                if (isResult)
                {
                    return Ok(new
                    {
                        Message = "Employee Salary Revision is saved successfully.",
                        Data = Mapper.Map<TblEmployeeSalaryRevision, EmployeeSalaryRevisionModel>(obj)
                    });
                }
                else
                {
                    return BadRequest(new { Message = "Employee Salary Revision is Not saved successfully." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Employee Salary Revision is Not saved successfully: Error - : {ex}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("DeleteSalaryRevision/{id:long}")]
        public async Task<ActionResult> DeleteSalaryRevision(long id)
        {
            try
            {
                var result = await _salaryRevisionService.tbldelete(id);
                if (result)
                {
                    return Ok(new { Message = "Employee Salary Revision is Deleted successfully." });
                }
                else
                {
                    return BadRequest(new { Message = "Employee Salary Revision is Not Deleted." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Employee Salary Revision is Not Deleted: Error : {ex}");
                return BadRequest();
            }
        }
    }
}

