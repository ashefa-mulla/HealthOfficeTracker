using AutoMapper;
using BusinessApp.Data;
using BusinessApp.Models;
using BusinessApp.Settings;
using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Custom.Employee;
using BusinessService.Custom.Evaluation;
using BusinessService.Custom.EvaluationLock;
using BusinessService.Custom.EvaluationQuestions;
using BusinessService.Custom.Feedbackform;
using BusinessService.Custom.TaskActivity;
using BusinessService.Custom.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class EmployeeController : ControllerBase
    {

        private readonly IMapper Mapper;
        private readonly ILogger<EmployeeController> Logger;
        private readonly IEmployeeService employeeService;
        private readonly IFeedbackformService feedbackformService;
        private readonly IEvaluationQuestionsService evaluationquestionsService;
        private readonly IUserService userServices;
        private readonly ApplicationSettings appSettings;
        private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager;
        private readonly IEvaluationService evaluationService;
        private readonly IEvaluationLockService evaluationLockService;

        public EmployeeController(IMapper _Mapper, ILogger<EmployeeController> _Logger, IEmployeeService _employeeService, IFeedbackformService _feedbackformService,
            IUserService _userServices, IOptions<ApplicationSettings> _appSettings, Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _userManager, IEvaluationService _evaluationService, 
            IEvaluationQuestionsService _evaluationQuestionsService, IEvaluationLockService _evaluationLockService)
        {
            Mapper = _Mapper;
            Logger = _Logger;
            employeeService = _employeeService;
            userServices = _userServices;
            userManager = _userManager;
            appSettings = _appSettings.Value;
            feedbackformService = _feedbackformService;
            evaluationService = _evaluationService;
            evaluationquestionsService = _evaluationQuestionsService;
            evaluationLockService = _evaluationLockService;

        }

        [HttpGet("getuserlist")]
        public async Task<IActionResult> GetUserList()
        {
            var result = await employeeService.Getbyemployerlist();
            IEnumerable<EmployeeModel> model = Mapper.Map<IEnumerable<TblEmployer>, IEnumerable<EmployeeModel>>(result.ToList());
            return Ok(model);
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<EmployeeModel>> Get(int id)
        {
            try
            {
                EmployeeModel model = new EmployeeModel();
                var result = await employeeService.Get(id);
                if (result != null)
                {
                    model = Mapper.Map<TblEmployer, EmployeeModel>(result);
                    model.Profileimage = model.Profileimage != "" ? (result.Profileimage != null ? (result.Profileimage != "NoFile" ? result.Profileimage : "NoFile") : "NoFile") : "Nofile";
                    model.Cvdoc = model.Cvdoc != "" ? (result.Cvdoc != null ? (result.Cvdoc != "NoFile" ? result.Cvdoc : "NoFile") : "NoFile") : "NoFile";
                    model.AgreementDoc = model.AgreementDoc != "" ? (result.AgreementDoc != null ? (result.AgreementDoc != "NoFile" ? result.AgreementDoc : "NoFile") : "NoFile") : "Nofile";
                    TblUserMaster tbluser = await userServices.Get(Convert.ToInt16(result.UserId));
                    model.UserMaster = Mapper.Map<TblUserMaster, UserModel>(tbluser);
                    IdentityUser User = await userManager.FindByIdAsync(model.UserMaster.IdentityID);
                    model.UserMaster.UserName = User.UserName;
                }
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

        [HttpPost("AddEditEmployee")]
        public async Task<ActionResult<EmployeeFormModel>> AddEditEmployee(EmployeeFormModel model)
        {
            try
            {
                bool isResult = false;
                TblEmployer obj = Mapper.Map<EmployeeModel, TblEmployer>(model.EmployeeProfile);
                UserModel userModel = model.UserDetail;
                TblUserMaster userMaster = Mapper.Map<UserModel, TblUserMaster>(userModel);
                if (obj.Id != 0)
                {
                    isResult = await employeeService.tblUpdate(obj);
                    isResult = await userServices.Tbl_Update(userMaster);
                }
                else
                {
                    var identityuser = new ApplicationUser() { UserName = model.UserDetail.UserName, Isactive = true };
                    var result = this.userManager.CreateAsync(identityuser, model.UserDetail.Password);

                    if (result.Result.Succeeded)
                    {
                        userMaster.IdentityId = identityuser.Id;
                        int UserID = await userServices.Tbl_Insert(userMaster);
                        if (UserID > 0)
                        {
                            try
                            {
                                obj.EmployerCode = "0000";
                                obj.UserId = UserID;
                                obj.Active = true;
                                obj.CompanyId = 1;
                                obj.Branch = 1;
                                isResult = await employeeService.tblInsert(obj);
                            }
                            catch (Exception ex) {
                                await this.userManager.DeleteAsync(identityuser);
                                Logger.LogError($"Error - : {ex}");
                                return BadRequest(new { message = "Incorrect!!" });
                            }
                        }
                        else
                        {
                            result = this.userManager.DeleteAsync(identityuser);
                            return BadRequest(new { message = "Incorrect!!" });
                        }
                    }
                    
                }
                if (isResult)
                {
                    return Ok(new { message = "Success!!" });
                }
                else
                {
                    return BadRequest(new { message = "Incorrect!!" });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : {ex}");
            }
            return BadRequest(new { message = "Incorrect!!" });
        }


        [HttpPost("changepassword")]
        public async Task<ActionResult<ChangePassword>> ChangePassword([FromBody] ChangePassword model)
        {
            try
            {
                PasswordHasher<ApplicationUser> passwordHasher = new PasswordHasher<ApplicationUser>();
                var result = false;
                string message = "Invalid Old Password";
                ApplicationUser user = await this.userManager.FindByIdAsync(model.IdentityID);
                bool isCurrentPassword = await this.userManager.CheckPasswordAsync(user, model.OldPassword);
                if (isCurrentPassword)
                {
                    string hasherpswd = passwordHasher.HashPassword(user, model.Password);
                    result = await employeeService.ChangePassword(model.IdentityID, hasherpswd);
                }
                else {
                    return NotFound(new { message });
                }
                if (result)
                {
                    message = "Valid";
                    return Ok(new { message });
                }

            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : { ex }");
            }
            return BadRequest();
        }

        [HttpPost("Changeusername")]
        public async Task<ActionResult<ChangePassword>> ChangeUserName([FromBody] ChangeUserName model)
        {
            try
            {
                PasswordHasher<ApplicationUser> passwordHasher = new PasswordHasher<ApplicationUser>();
                var result = false;
                string message = "User name is not updated";
                ApplicationUser user = await this.userManager.FindByIdAsync(model.IdentityID);
                //bool isCurrentPassword = await this.userManager.CheckPasswordAsync(user, model.UserName);
                if (user != null)
                {
                    result = await employeeService.ChangeUsername(model.IdentityID, model.UserName);
                }
                else
                {
                    return NotFound(new { message });
                }
                if (result)
                {
                    message = "User name is updated";
                    return Ok(new { message });
                }

            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : { ex }");
            }
            return BadRequest();
        }
        [HttpDelete("delete/{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await employeeService.tblDelete(id);
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
        [HttpGet("deleteFile")]
        public async Task<ActionResult> deleteProfileFile(int id,string fieldname)
        {
            try
            {
                bool Result = false;
                TblEmployer model = await employeeService.Get(id);
                var pathToSave = "";
                if(fieldname == "profileimage")
                {
                pathToSave = Path.Combine(Directory.GetCurrentDirectory(), model.Profileimage);
                model.Profileimage = "NoFile";
                }
                else if(fieldname == "cvdoc")
                {
                    pathToSave = Path.Combine(Directory.GetCurrentDirectory(), model.Cvdoc);
                    model.Cvdoc = "NoFile";
                }
                else
                {
                    pathToSave = Path.Combine(Directory.GetCurrentDirectory(), model.AgreementDoc);
                    model.AgreementDoc = "NoFile";
                }    
                if (System.IO.File.Exists(pathToSave))
                {
                    System.IO.File.Delete(pathToSave);

                }
                Result = await employeeService.tblUpdate(model);
                if (Result)
                    return Ok(model);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }

        //Feedback form 01-20 2025 GJ
        [HttpGet("getusersforfeedbackform")]
        public async Task<ActionResult<sp_get_userforfeedbackform_Results>> Getuserforfeedback()
        {
            try
            {
                var result = await feedbackformService.Getuserforfeedback();

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

        [HttpGet("getquestionsforfeedbackform")]
        public async Task<ActionResult<sp_get_questionsforfeedbackform_Results>> Getquestionsforfeedback()
        {
            try
            {
                var result = await feedbackformService.Getquestionsforfeedback();

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
        

        [HttpPost("addeditfeedbackform")]
        public async Task<ActionResult> AddEditLabTests([FromBody] List<Matrix4teamAnswerModel> models)
        {
            if (models == null || models.Count == 0)
            {
                return BadRequest(new { isMessage = false, result = "No data received!" });
            }

            try
            {
                bool isSuccess = true;
                List<string> errorList = new List<string>();

                foreach (var model in models)
                {
                    TblMatrix4teamAnswer obj = Mapper.Map<Matrix4teamAnswerModel, TblMatrix4teamAnswer>(model);

                    bool result;
                    if (model.Id != 0)
                    {
                        result = await feedbackformService.tblUpdate(obj);
                    }
                    else
                    {
                        result = await feedbackformService.tblInsert(obj);
                    }

                    if (!result)
                    {
                        isSuccess = false;
                        errorList.Add($"Failed to save data for Question ID: {model.Id}");
                    }
                }

                if (isSuccess)
                {
                    return Ok(new { isMessage = true, result = "All data saved successfully!" });
                }
                else
                {
                    return BadRequest(new { isMessage = false, result = "Some records failed to save.", errors = errorList });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { isMessage = false, result = "Error occurred!", errorDetails = ex.Message });
            }
        }

        [HttpGet("getevaluationquestionsbyemployee/{empId}")]
        public async Task<ActionResult<IEnumerable<sp_getevaluationquestionsbyemployee_Results>>> GetEvaluationQuestionsByEmployee(int empId)
        {
            try
            {
                var result = await evaluationService.GetEvaluationQuestionsByEmployee(empId);

                if (result != null && result.Any())
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound("No active questions found.");
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return BadRequest("Something went wrong.");
            }
        }
        
        
        [HttpPost("addeditevaluationsubmission")]
        public async Task<ActionResult<EvaluationSubmissionModel>> AddEditEvaluationSubmission(EvaluationSubmissionModel model)
        {
            try
            {
                bool isResult = false;

                // Map model to entity
                TblEvaluationSubmission obj = Mapper.Map<EvaluationSubmissionModel, TblEvaluationSubmission>(model);
                obj.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

                if (obj.Id != 0)
                {
                    isResult = await evaluationService.tblUpdate(obj);
                }
                else
                {
                    isResult = await evaluationService.tblInsert(obj);
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
                Logger.LogError($"Error in AddEditEvaluationSubmission: {ex}");
                return BadRequest();
            }
        }



        [HttpGet("getevaluationsforedit")]
        public async Task<ActionResult<IEnumerable<sp_getevaluationsubmissionsforedit_Results>>> GetEvaluationsForEdit(
            int? employeeId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var results = await evaluationService.GetEvaluationsForEdit(employeeId, startDate, endDate);
                return Ok(results);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEvaluationsForEdit: {ex}");
                return BadRequest("Error fetching evaluations for edit.");
            }
        }


        [HttpGet("getlast8evaluationssummary/{empId}")]
        public async Task<ActionResult<IEnumerable<sp_getlast8evaluationssummary_Results>>> Getlast8EvaluationsSummary(int empId)
        {
            try
            {
                var result = await evaluationService.Getlast8EvaluationsSummary(empId);

                if (result != null && result.Any())
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound("No active questions found.");
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return BadRequest("Something went wrong.");
            }
        }




        //[HttpGet("getmonthlyevaluationsummary")]
        //public async Task<ActionResult<IEnumerable<sp_getmonthlyevaluationsummary_Result>>> GetMonthlyEvaluationSummary([FromQuery] int employeeId, [FromQuery] int evalYear,[FromQuery] int evalMonth)
        //{
        //    try
        //    {
        //        var result = await evaluationService.GetMonthlyEvaluationSummary(employeeId, evalYear, evalMonth);

        //        if (result != null && result.Any())
        //            return Ok(result);
        //        else
        //            return NotFound("No evaluation summary found for the given parameters.");
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError($"Error in GetMonthlyEvaluationSummary: {ex}");
        //        return BadRequest("Error fetching monthly summary.");
        //    }
        //}


        [HttpGet("getmonthlyevaluationsummary")]
        public async Task<ActionResult<IEnumerable<sp_getmonthlyevaluationsummary_Result>>> GetMonthlyEvaluationSummary(
    [FromQuery] int employeeId,
    [FromQuery] int? evalYear = null,
    [FromQuery] int? evalMonth = null)
        {
            try
            {
                // 🧠 Automatically use current month/year if not provided
                int year = evalYear ?? DateTime.Now.Year;
                int month = evalMonth ?? DateTime.Now.Month;

                var result = await evaluationService.GetMonthlyEvaluationSummary(employeeId, year, month);

                if (result != null && result.Any())
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound("No evaluation summary found for the given parameters.");
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetMonthlyEvaluationSummary: {ex}");
                return BadRequest("An unexpected error occurred while fetching the evaluation summary.");
            }
        }





        [HttpPost("addmonthlyevaluationsubmission")]
        public async Task<ActionResult> AddEditEvaluations([FromBody] List<EvaluationSubmissionModel> models)
        {
            if (models == null || models.Count == 0)
            {
                return BadRequest(new { isMessage = false, result = "No data received!" });
            }

            try
            {
                bool isSuccess = true;
                List<string> errorList = new List<string>();

                foreach (var model in models)
                {
                    TblEvaluationSubmission obj = Mapper.Map<EvaluationSubmissionModel, TblEvaluationSubmission>(model);

                    bool result;
                    if (model.Id != 0)   // Update if Id exists
                    {
                        result = await evaluationService.tblUpdate(obj);
                    }
                    else                 // Insert if Id = 0
                    {
                        result = await evaluationService.tblInsert(obj);
                    }

                    if (!result)
                    {
                        isSuccess = false;
                        errorList.Add($"Failed to save data for Question ID: {model.QuestionId}");
                    }
                }

                if (isSuccess)
                {
                    return Ok(new { isMessage = true, result = "All data saved successfully!" });
                }
                else
                {
                    return BadRequest(new { isMessage = false, result = "Some records failed to save.", errors = errorList });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { isMessage = false, result = "Error occurred!", errorDetails = ex.Message });
            }
        }



       


        //[HttpPost("addeditevaluationquestion")]
        //public async Task<IActionResult> AddEditEvaluationQuestion([FromBody] EvaluationQuestionModel model)
        //{
        //    try
        //    {
        //        if (model == null)
        //            return BadRequest("Invalid data.");

        //        // 🧠 Ensure EmployeeID is provided
        //        if (model.EmployeeId <= 0)
        //            return BadRequest("EmployeeID is required.");

        //        // 🧩 Map model to entity
        //        TblEvaluationQuestion obj = Mapper.Map<EvaluationQuestionModel, TblEvaluationQuestion>(model);

        //        if (obj.Id == 0)
        //        {
        //            // New question
        //            obj.CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        //            obj.IsActive = true;

        //            bool inserted = await evaluationquestionsService.tblInsert(obj);
        //            if (!inserted)
        //                return BadRequest("Insert failed.");

        //            return Ok(new { success = true, message = "Question added successfully." });
        //        }
        //        else
        //        {
        //            // Update existing question
        //            bool updated = await evaluationquestionsService.tblUpdate(obj);
        //            if (!updated)
        //                return BadRequest("Update failed.");

        //            return Ok(new { success = true, message = "Question updated successfully." });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError($"Error in AddEditEvaluationQuestion: {ex}");
        //        return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
        //    }
        //}



        [HttpPost("addeditevaluationquestion")]
        public async Task<IActionResult> AddEditEvaluationQuestion([FromBody] EvaluationQuestionModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest("Invalid data.");

                if (model.EmployeeId <= 0)
                    return BadRequest("EmployeeID is required.");

                if (model.Id == 0)
                {
                    var obj = Mapper.Map<EvaluationQuestionModel, TblEvaluationQuestion>(model);

                    obj.CreatedAt = DateOnly.FromDateTime(DateTime.Now);
                    obj.IsActive = true;

                    bool inserted = await evaluationquestionsService.tblInsert(obj);

                    if (!inserted)
                        return BadRequest("Insert failed.");

                    return Ok(new { success = true, message = "Question added successfully." });
                }
                else
                {
                    var existing = await evaluationquestionsService.Get(model.Id);

                    if (existing == null)
                        return NotFound("Question not found.");

                    existing.QuestionText = model.QuestionText;
                    existing.EmployeeId = model.EmployeeId;
                    existing.IsActive = model.IsActive;
                    existing.DeactivatedAt = model.DeactivatedAt;

                    bool updated = await evaluationquestionsService.tblUpdate(existing);

                    if (!updated)
                        return BadRequest("Update failed.");

                    return Ok(new { success = true, message = "Question updated successfully." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in AddEditEvaluationQuestion: {ex}");
                return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
            }
        }

        // ✅ Get all evaluation questions
        [HttpGet("getevaluationquestions")]
        public async Task<ActionResult<IEnumerable<EvaluationQuestionModel>>> GetEvaluationQuestions()
        {
            try
            {
                var result = await evaluationquestionsService.tblGetAll();
                var mapped = Mapper.Map<IEnumerable<TblEvaluationQuestion>, IEnumerable<EvaluationQuestionModel>>(result);
                return Ok(mapped);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEvaluationQuestions: {ex}");
                return BadRequest("Failed to retrieve evaluation questions.");
            }
        }

        // ✅ Get single evaluation question by ID
        [HttpGet("getevaluationquestionbyid/{id}")]
        public async Task<ActionResult<EvaluationQuestionModel>> GetEvaluationQuestionById(int id)
        {
            try
            {
                var result = await evaluationquestionsService.Get(id);
                if (result == null)
                    return NotFound();

                var mapped = Mapper.Map<TblEvaluationQuestion, EvaluationQuestionModel>(result);
                return Ok(mapped);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in GetEvaluationQuestionById: {ex}");
                return BadRequest("Failed to retrieve evaluation question details.");
            }
        }

        // ✅ Delete evaluation question by ID
        [HttpDelete("deleteevaluationquestion/{id}")]
        public async Task<ActionResult> DeleteEvaluationQuestion(int id)
        {
            try
            {
                bool isDeleted = await evaluationquestionsService.tblDelete(id);

                if (!isDeleted)
                    return BadRequest("Delete failed.");

                return Ok(new { success = true, message = "Deleted successfully." });
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in DeleteEvaluationQuestion: {ex}");
                return BadRequest("An unexpected error occurred while deleting the evaluation question.");
            }
        }

        [HttpPost("toggleevaluationquestionstatus/{id}")]
        public async Task<IActionResult> ToggleEvaluationQuestionStatus(int id)
        {
            try
            {
                bool result = await evaluationquestionsService.ToggleEvaluationQuestionStatus(id);
                if (!result)
                    return BadRequest("Failed to toggle status or question not found.");

                return Ok(new { success = true, message = "Status updated successfully." });
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in ToggleEvaluationQuestionStatus: {ex}");
                return BadRequest("Something went wrong while changing question status.");
            }
        }



        [HttpPost("lockevaluation")] //addeditlockevaluation
        public async Task<IActionResult> AddEditEvaluationLock([FromBody] EvaluationLockModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest("Invalid data.");

                if (model.EmployeeId <= 0)
                    return BadRequest("EmployeeID is required.");

                if (model.EvalYear <= 0 || model.EvalMonth <= 0 || model.EvalMonth > 12)
                    return BadRequest("Valid evaluation year and month are required.");

                // Map model to entity (TblEvaluationLock assumed to exist)
                TblEvaluationLock obj = Mapper.Map<EvaluationLockModel, TblEvaluationLock>(model);

                if (obj.Id == 0)
                {
                    // New lock record
                    obj.LockedAt = DateTime.Now;

                    bool inserted = await evaluationLockService.tblinsert(obj);
                    if (!inserted)
                        return BadRequest("Insert failed.");

                    return Ok(new { success = true, message = "Lock added successfully." });
                }
                else
                {
                    // Update existing lock record
                    obj.LockedAt = DateTime.Now; // update lock timestamp

                    bool updated = await evaluationLockService.tblupdate(obj);
                    if (!updated)
                        return BadRequest("Update failed.");

                    return Ok(new { success = true, message = "Lock updated successfully." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error in AddEditEvaluationLock: {ex}");
                return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
            }
        }


        [HttpGet("getmonthlyevaluationreportsummary")]
        public async Task<ActionResult<IEnumerable<sp_getmonthlyevaluationreportsummary_Results>>> GetMonthlyEvaluationReportSummary([FromQuery] int? year = null,[FromQuery] int? month = null)
        {
            try
            {
                // Default to current year/month if not provided
                int evalYear = year ?? DateTime.Now.Year;
                int evalMonth = month ?? DateTime.Now.Month;

                var result = await evaluationService.GetMonthlyEvaluationReportSummary(evalYear, evalMonth);

                if (result != null && result.Any())
                {
                    return Ok(result);
                }

                return NotFound("No evaluation report summary found for the given parameters.");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error in GetMonthlyEvaluationReportSummary");
                return BadRequest("An error occurred while fetching the monthly evaluation report summary.");
            }
        }


    }
}
