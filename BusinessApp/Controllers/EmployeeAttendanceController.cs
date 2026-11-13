using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BusinessApp.Models;
using BusinessApp.Utilities;
using BusinessData.DataContext;
using BusinessService.Custom.Employee;
using BusinessService.Custom.EmployeeAttendance;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeAttendanceController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IEmployeeAttendanceService _employeeAttendanceService;
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeeAttendanceController> Logger;

        public EmployeeAttendanceController(
            IMapper mapper,
            ILogger<EmployeeAttendanceController> logger,
            IEmployeeAttendanceService employeeAttendanceService,
            IEmployeeService employeeService)
        {
            Mapper = mapper;
            Logger = logger;
            _employeeAttendanceService = employeeAttendanceService;
            _employeeService = employeeService;
        }

        [HttpGet("GetEmployeeAttendance/{id:int}")]
        public async Task<ActionResult<EmployeeAttendanceModel>> Get(int id)
        {
            try
            {
                var result = await _employeeAttendanceService.Get(id);
                if (result != null)
                {
                    var model = Mapper.Map<TblEmployeeAttendance, EmployeeAttendanceModel>(result);
                    return Ok(model);
                }
                else
                {
                    return Ok(new EmployeeAttendanceModel());
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEmployeeAttendance: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetEmployeeAttendance")]
        public async Task<ActionResult<EmployeeAttendanceModel>> GetEmployeeAttendance([FromQuery] int empId, [FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                var result = await _employeeAttendanceService.GetByEmpAndMonthYear(empId, month, year);
                if (result != null)
                {
                    var model = Mapper.Map<TblEmployeeAttendance, EmployeeAttendanceModel>(result);
                    return Ok(model);
                }
                else
                {
                    return Ok(new EmployeeAttendanceModel());
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEmployeeAttendance by emp, month, year: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("GetEmployeeAttendanceList")]
        public async Task<IActionResult> GetEmployeeAttendanceList(
            [FromQuery] int? month = null,
            [FromQuery] int? year = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 100,
            [FromQuery] string search = null)
        {
            try
            {
                var countResult = await _employeeAttendanceService.GetEmployeeAttendanceRecords(month, year, search);
                int totalCount = countResult?.FirstOrDefault()?.TotalRows ?? 0;

                var result = await _employeeAttendanceService.GetEmployeeAttendanceList(month, year, pageNumber, pageSize, search);

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
                        data = new List<spa_getemployeeattendance_Result>(),
                        totalCount = 0,
                        pageSize = pageSize,
                        currentPage = pageNumber,
                        totalPages = 0
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEmployeeAttendanceList: {ex}");
                return BadRequest();
            }
        }

        [HttpPost("AddEditEmployeeAttendance")]
        public async Task<ActionResult> AddEditEmployeeAttendance([FromBody] EmployeeAttendanceModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(new { Message = "Invalid attendance data." });
                }

                bool isResult = false;
                TblEmployeeAttendance obj = Mapper.Map<EmployeeAttendanceModel, TblEmployeeAttendance>(model);
                obj.UpdatedDate = DateTime.Now;

                if (obj.Id != 0)
                {
                    isResult = await _employeeAttendanceService.tblupdate(obj);
                }
                else
                {
                    // Check if record already exists for this employee, month, and year
                    int targetYear = obj.Year ?? DateTime.Now.Year;
                    var existing = await _employeeAttendanceService.GetByEmpAndMonthYear(obj.EmpId, obj.Month, targetYear);
                    if (existing != null)
                    {
                        existing.WorkingDays = obj.WorkingDays;
                        existing.Attendance = obj.Attendance;
                        existing.Pl = obj.Pl;
                        existing.Cl = obj.Cl;
                        existing.Sl = obj.Sl;
                        existing.UpdatedBy = obj.UpdatedBy;
                        existing.UpdatedDate = DateTime.Now;
                        isResult = await _employeeAttendanceService.tblupdate(existing);
                        obj.Id = existing.Id;
                    }
                    else
                    {
                        isResult = await _employeeAttendanceService.tblinsert(obj);
                    }
                }

                if (isResult)
                {
                    return Ok(new { Message = "Employee Attendance is saved successfully.", Data = Mapper.Map<TblEmployeeAttendance, EmployeeAttendanceModel>(obj) });
                }
                else
                {
                    return BadRequest(new { Message = "Employee Attendance is Not saved successfully." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Employee Attendance is Not saved successfully: Error - : {ex}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("InsertEmployeeAttendance")]
        public async Task<ActionResult> InsertEmployeeAttendance([FromBody] EmployeeAttendanceModel model)
        {
            return await AddEditEmployeeAttendance(model);
        }

        [HttpDelete("DeleteEmployeeAttendance/{id:int}")]
        public async Task<ActionResult> DeleteEmployeeAttendance(int id)
        {
            try
            {
                var result = await _employeeAttendanceService.tbldelete(id);
                if (result)
                {
                    return Ok(new { Message = "Employee Attendance is Deleted successfully." });
                }
                else
                {
                    return BadRequest(new { Message = "Employee Attendance is Not Deleted." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Employee Attendance is Not Deleted: Error : {ex}");
                return BadRequest();
            }
        }

        [HttpPost("UploadAttendanceExcel")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult<UploadAttendanceResult>> UploadAttendanceExcel()
        {
            var response = new UploadAttendanceResult();

            try
            {
                var file = (Request.Form.Files != null && Request.Form.Files.Count > 0) ? Request.Form.Files[0] : null;

                if (file == null || file.Length == 0)
                {
                    response.Success = false;
                    response.Message = "No file uploaded. Please select an Excel (.xlsx) or CSV file.";
                    return BadRequest(response);
                }

                string ext = Path.GetExtension(file.FileName)?.ToLowerInvariant();
                if (ext != ".xlsx" && ext != ".csv" && ext != ".xls")
                {
                    response.Success = false;
                    response.Message = "Invalid file type. Only .xlsx and .csv files are supported.";
                    return BadRequest(response);
                }

                List<Dictionary<string, string>> rows;
                using (var stream = file.OpenReadStream())
                {
                    rows = ExcelAttendanceReader.ReadExcelOrCsv(stream, file.FileName);
                }

                if (rows == null || rows.Count == 0)
                {
                    response.Success = false;
                    response.Message = "The uploaded file does not contain any data rows.";
                    return BadRequest(response);
                }

                response.TotalRows = rows.Count;

                // Load employers for code / ID resolution
                var employers = (await _employeeService.Getbyemployerlist())?.ToList() ?? new List<TblEmployer>();
                var employerIdMap = employers.ToDictionary(e => e.Id, e => e);
                var employerCodeMap = employers
                    .Where(e => !string.IsNullOrWhiteSpace(e.EmployerCode))
                    .GroupBy(e => e.EmployerCode.Trim().ToLowerInvariant())
                    .ToDictionary(g => g.Key, g => g.First());

                int rowIndex = 1; // 1-based data row counter (row 1 is header in Excel)

                foreach (var row in rows)
                {
                    rowIndex++;
                    try
                    {
                        string empCdStr = GetValue(row, "empcd", "empcode", "employeeid", "employeecode", "empid", "eid");
                        string monthStr = GetValue(row, "month", "mth");
                        string yearStr = GetValue(row, "year", "yr");
                        string workingDaysStr = GetValue(row, "workingda", "workingdays", "working_days", "workdays");
                        string attendanceStr = GetValue(row, "attendanc", "attendance", "present");
                        string plStr = GetValue(row, "pl", "pleaves");
                        string clStr = GetValue(row, "cl", "cleaves");
                        string slStr = GetValue(row, "sl", "sleaves", "sickleaves");

                        // 1. Resolve Employee ID
                        int empId = 0;
                        if (!string.IsNullOrWhiteSpace(empCdStr))
                        {
                            string trimmed = empCdStr.Trim();
                            if (int.TryParse(trimmed, out int parsedId) && employerIdMap.ContainsKey(parsedId))
                            {
                                empId = parsedId;
                            }
                            else if (employerCodeMap.TryGetValue(trimmed.ToLowerInvariant(), out var empByCode))
                            {
                                empId = empByCode.Id;
                            }
                            else if (int.TryParse(trimmed, out int fallbackId) && fallbackId > 0)
                            {
                                empId = fallbackId;
                            }
                        }

                        if (empId <= 0)
                        {
                            response.FailedCount++;
                            response.Errors.Add($"Row {rowIndex}: Unable to find employee with code/ID '{empCdStr}'.");
                            continue;
                        }

                        // 2. Parse Month
                        int month = 0;
                        if (!string.IsNullOrWhiteSpace(monthStr))
                        {
                            if (int.TryParse(monthStr, out int m) && m >= 1 && m <= 12)
                            {
                                month = m;
                            }
                            else if (DateTime.TryParseExact(monthStr.Trim(), new[] { "MMMM", "MMM" }, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var dtMonth))
                            {
                                month = dtMonth.Month;
                            }
                        }

                        if (month < 1 || month > 12)
                        {
                            response.FailedCount++;
                            response.Errors.Add($"Row {rowIndex}: Invalid Month '{monthStr}'.");
                            continue;
                        }

                        // 3. Parse Year
                        int year = DateTime.Now.Year;
                        if (!string.IsNullOrWhiteSpace(yearStr) && int.TryParse(yearStr, out int y) && y >= 2000 && y <= 2100)
                        {
                            year = y;
                        }

                        // 4. Parse Numeric fields
                        decimal workingDays = 0;
                        if (!string.IsNullOrWhiteSpace(workingDaysStr)) decimal.TryParse(workingDaysStr, out workingDays);

                        decimal attendance = 0;
                        if (!string.IsNullOrWhiteSpace(attendanceStr)) decimal.TryParse(attendanceStr, out attendance);

                        decimal pl = 0;
                        if (!string.IsNullOrWhiteSpace(plStr)) decimal.TryParse(plStr, out pl);

                        decimal cl = 0;
                        if (!string.IsNullOrWhiteSpace(clStr)) decimal.TryParse(clStr, out cl);

                        decimal sl = 0;
                        if (!string.IsNullOrWhiteSpace(slStr)) decimal.TryParse(slStr, out sl);

                        // 5. Upsert to Tbl_Employee_Attendance
                        var existing = await _employeeAttendanceService.GetByEmpAndMonthYear(empId, month, year);
                        if (existing != null)
                        {
                            existing.WorkingDays = workingDays;
                            existing.Attendance = attendance;
                            existing.Pl = pl;
                            existing.Cl = cl;
                            existing.Sl = sl;
                            existing.UpdatedDate = DateTime.Now;

                            bool updated = await _employeeAttendanceService.tblupdate(existing);
                            if (updated)
                            {
                                response.UpdatedCount++;
                            }
                            else
                            {
                                response.FailedCount++;
                                response.Errors.Add($"Row {rowIndex}: Failed to update attendance for employee {empId}.");
                            }
                        }
                        else
                        {
                            var newRecord = new TblEmployeeAttendance
                            {
                                EmpId = empId,
                                Month = month,
                                Year = year,
                                WorkingDays = workingDays,
                                Attendance = attendance,
                                Pl = pl,
                                Cl = cl,
                                Sl = sl,
                                UpdatedDate = DateTime.Now
                            };

                            bool inserted = await _employeeAttendanceService.tblinsert(newRecord);
                            if (inserted)
                            {
                                response.InsertedCount++;
                            }
                            else
                            {
                                response.FailedCount++;
                                response.Errors.Add($"Row {rowIndex}: Failed to insert attendance for employee {empId}.");
                            }
                        }
                    }
                    catch (Exception exRow)
                    {
                        response.FailedCount++;
                        response.Errors.Add($"Row {rowIndex}: {exRow.Message}");
                    }
                }

                response.Success = response.FailedCount == 0 || (response.InsertedCount + response.UpdatedCount > 0);
                response.Message = $"Excel processed. Total: {response.TotalRows}, Inserted: {response.InsertedCount}, Updated: {response.UpdatedCount}, Failed: {response.FailedCount}.";

                return Ok(response);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in UploadAttendanceExcel: {ex}");
                response.Success = false;
                response.Message = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        private static string GetValue(Dictionary<string, string> row, params string[] possibleHeaders)
        {
            foreach (var key in row.Keys)
            {
                string cleanedKey = key.Replace("_", "").Replace(" ", "").Replace("-", "").ToLowerInvariant();
                foreach (var header in possibleHeaders)
                {
                    string cleanedHeader = header.Replace("_", "").Replace(" ", "").Replace("-", "").ToLowerInvariant();
                    if (cleanedKey == cleanedHeader || cleanedKey.StartsWith(cleanedHeader))
                    {
                        return row[key];
                    }
                }
            }
            return null;
        }
    }
}
