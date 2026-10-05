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
using BusinessService.Custom.Employee;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BusinessApp.Controllers
{
    // [Route("api/[controller]")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IUserService _userService;
        private readonly ApplicationSettings _appSettings;
        private readonly IEmployeeService _employeeService;
        //private readonly IPatientsServices _patientsServices;
        //private readonly IClientService _clientService;
        //private readonly IResetPasswordService _resetPasswordService;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ILogger<AccountController> logger, IOptions<ApplicationSettings> appSettings, IUserService userService
            ,IEmployeeService employeeService/*, IPatientsServices patientsServices, IClientService clientService, IResetPasswordService resetPasswordService*/)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _userService = userService;
            _appSettings = appSettings.Value;
            _employeeService = employeeService;
            //_patientsServices = patientsServices;
            //_cliniciansServices = cliniciansServices;
            //_clientService = clientService;
            //_resetPasswordService = resetPasswordService;

        }

        [HttpGet]
        [Route("test")]

        //Post: api/account/login
        public IActionResult Test()
        {
            return Ok();
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);

            if (user != null)
            {
                var uid = await _userService.GetUserId(user.Id) as List<GetUserId>;
                var userid = uid[0].UserId;
                var utype = uid[0].UserType;
                var userrole = uid[0].UserRole;
                var employeedata = await _employeeService.GetByUserID(userid);
                var username = model.Email;
                var pwd = await _userManager.CheckPasswordAsync(user, model.Password);
                if (pwd == true)
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        //Subject = new ClaimsIdentity(new Claim[]
                        //{
                        //    new Claim(ClaimTypes.NameIdentifier, employeedata.Firstname + " " + employeedata.Lastname),
                        //    new Claim(ClaimTypes.Name, model.Email),
                        //    new Claim(ClaimTypes.Email, model.Email),
                        //    new Claim("UserID", user.Id.ToString())
                        //}),
                        Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, employeedata.Id.ToString()), // FIXED
                        new Claim(ClaimTypes.Name, employeedata.Firstname + " " + employeedata.Lastname),
                        new Claim(ClaimTypes.Email, model.Email),
                        new Claim("UserID", user.Id.ToString())
                    }),
                        //1440
                        Expires = DateTime.UtcNow.AddMinutes(30),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.App_Token)), SecurityAlgorithms.HmacSha256Signature)
                    };

                   
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var access_token = tokenHandler.WriteToken(securityToken);

                    var entityId = 0;
                    var offset = _appSettings.Offset;
                    var jobstarthr = _appSettings.jobstarthr;
                    var ISTjobstarthr = _appSettings.ISTjobstarthr;
                    var Timezone = uid[0].TimeZone;
                    bool? IsNewUser = false;
                   
                    int Employeeid = 0;
                    int? BranchId = 1;
                    int? CompanyId = 1;
                    var Profileimage = "FileServer/DefaultImg/profiles/avatar-mini.png";
                    if (employeedata != null)
                    {
                        Employeeid = employeedata.Id;
                        entityId = employeedata.UserId; //Girish - 01202022
                        Profileimage = employeedata.Profileimage != null ? employeedata.Profileimage : Profileimage;
                        BranchId = employeedata.Branch != 0 ? employeedata.Branch : 1;
                        CompanyId = employeedata.CompanyId != 0 ? employeedata.CompanyId : 1;
                    }


                    return Ok(new { access_token, username, userid, utype, entityId, IsNewUser, userrole, Timezone, Employeeid, Profileimage, BranchId, CompanyId, offset, ISTjobstarthr, jobstarthr });
                }
                else
                {
                    return NotFound(new { message = "Password is incorrect!!" });
                }
            }
            else if (user == null)
            {
                return NotFound(new { message = "UserName is incorrect!!" });
            }

            else
                return BadRequest(new { message = "UserName or Password is incorrect!!" });

        }


        [HttpPost("forgotpassword")]
        public async Task<ActionResult<ResetPassword>> ForgotPassword([FromBody] ResetPassword model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            //if (user != null)
            //{
                //    List<spa_resetpasswordcheck_Result> link = await _resetPasswordService.verifyPasswordLink(user.Id) as List<spa_resetpasswordcheck_Result>;
                //    if (link.Count == 0)
                //    {
                //        try
                //        {

                //            var currentdate = await _resetPasswordService.GetServerDate();
                //            TblResetPassword obj = new TblResetPassword();
                //            obj.IdentityId = user.Id;
                //            obj.EmailId = model.UserName;
                //            obj.RequestDt = currentdate.FirstOrDefault().ServerDateTime;
                //            obj.UpdateDt = currentdate.FirstOrDefault().ServerDateTime;

                //            bool inst = await _resetPasswordService.tblInsert(obj);
                //            if (inst)
                //            {
                //                Dictionary<string, string> dic = new Dictionary<string, string>();
                //                dic.Add("[@id]", string.Concat(user.Id));
                //                string body = EmailUtility.mailBody(_appSettings.ResetPasswordTemplate, dic);
                //                string subject = "Reset Password - Verification";
                //                SendmailAsync(model.UserName, _appSettings.CcEmail, _appSettings.FromEmail, subject, body);
                //                return Ok(new { isMessage = true, result = "Please check your email for the password reset link." });
                //            }
                //            else
                //            {
                //                return BadRequest();
                //            }

                //        }
                //        catch (Exception ex)
                //        {
                //            return BadRequest(ex);
                //        }
                //    }
                //    else
                //    {
                //        return Ok(new { isMessage = false, result = "Please check your email to reset password." });
                //    }
                //}
                //else
                //{
                //    return Ok(new { isMessage = false, result = "Invalid Username." });
                //}
                return null;
        }

        [HttpGet("verifylink")]
        public async Task<ActionResult<ResetPassword>> VerifyLink(string id)
        {
            //List<spa_resetpasswordcheck_Result> link = await _resetPasswordService.verifyPasswordLink(id) as List<spa_resetpasswordcheck_Result>;
            //if (link.Count == 1)
            //{
            //    return Ok(new { isMessage = true, result = "Valid link" });
            //}
            //else
            //{
            //    return Ok(new { isMessage = false, result = "Please check your email to reset password." });
            //}
            return null;
        }

        [HttpPost("resetpassword")]
        public async Task<ActionResult<ResetPassword>> ChangePassword([FromBody] ResetPassword model)
        {

            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null)
            {
                if (user.Id == model.Id)
                {
                    try
                    {
                        //List<spa_resetpasswordcheck_Result> link = await _resetPasswordService.verifyPasswordLink(user.Id) as List<spa_resetpasswordcheck_Result>;
                        //if (link.Count > 0)
                        //{
                        //    PasswordHasher passwordHasher = new PasswordHasher();
                        //    string hasherpswd = passwordHasher.HashPassword(model.Password);

                        //    bool isChangepassword = await _userService.ChangePassword(user.Id, hasherpswd);
                        //    if (isChangepassword)
                        //    {
                        //        Dictionary<string, string> dic = new Dictionary<string, string>();
                        //        dic.Add("[@NAME]", "");
                        //        dic.Add("[@USERNAME]", string.Concat(model.UserName));
                        //        dic.Add("[@PASSWORD]", string.Concat(model.Password));
                        //        string body = EmailUtility.mailBody(_appSettings.ForgotPasswordTemplate, dic);
                        //        string subject = "Reset Password Successfully";
                        //        SendmailAsync(model.UserName, _appSettings.CcEmail, _appSettings.FromEmail, subject, body);
                        //        return Ok(new { isMessage = true, result = "Password Successfully Updated." });
                        //    }
                        //    else
                        //    {
                        //        return Ok(new { isMessage = false, result = "Error while updating password." });
                        //    }
                        //}
                        //else
                        //{
                        //    return Ok(new { isMessage = false, result = "Your password link has been expired." });

                        //}
                        return null;
                    }

                    catch (Exception ex)
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    return Ok(new { isMessage = false, result = "Invalid Username." });
                }
            }
            //else
            //{
            //    return Ok(new { isMessage = false, result = "Invalid Username." });
            //}

            return null;
        }


        [HttpPost("changeusertimezone")]

        public async Task<IActionResult> ChangeUserTimezone(UserTimezoneModel model)
        {
            TblUserMaster obj = await _userService.Get(model.UserId);
            if (obj != null)
            {
                //obj.TimeZone = model.Timezone;
                //bool isChangetimezone = await _userService.Tbl_Update(obj);
                //if (isChangetimezone)
                //{
                //    if (model.UserType == 3)
                //    {
                //        TblClinician tblClinician = await _cliniciansServices.GetByUserid(model.UserId);
                //        if (tblClinician.TimeZone == null || tblClinician.TimeZone == "")
                //        {
                //            tblClinician.TimeZone = model.Timezone;
                //            bool isclinician = await _cliniciansServices.tblUpdate(tblClinician);
                //        }

                //    }
                //    if (model.UserType == 6)
                //    {
                //        TblPatient tblPatient = await _patientsServices.GetByUserid(model.UserId);
                //        if (tblPatient.TimeZone == null || tblPatient.TimeZone == "")
                //        {
                //            tblPatient.TimeZone = model.Timezone;
                //            bool ispatient = await _patientsServices.tblupdate(tblPatient);
                //        }
                //    }
                //}
                return Ok(new { isMessage = true, result = "Sucessfully Change" });
            }
            else
            {
                return Ok(new { isMessage = false, result = "Try Again" });
            }
        }
        public void SendmailAsync(string EmailTo, string EmailCc, string EmailFrom, string EmailSubject, string EmailBody, List<string> lstattachment = null)
        {
            EmailUtility response = new EmailUtility();
            //string key = _appSettings.SendGridAPIkey;
            ////----------------Test------------------//
            //string testemail = _appSettings.Testemail;
            //if (testemail.Length > 0)
            //{
            //    EmailTo = testemail;
            //}

            ////----------------Test------------------//
            //response.SendMail(key, EmailTo, EmailCc, EmailFrom, EmailSubject, EmailBody, lstattachment).Wait();
        }




        [HttpPost]
        [Route("authtoken")]

        public IActionResult GenrateAuthToken()
        {

            var token = Request.Headers["apikey"];


            if(_appSettings.App_Token == token)
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                            new Claim("UserID", "VOWatcher")
                    }),
                    //1440
                    //Expires = DateTime.UtcNow.AddMinutes(30),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.App_Token)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var access_token = tokenHandler.WriteToken(securityToken);
                return Ok(new { access_token });

            }
            else
            {
                return BadRequest(new { message = "API Key is incorrect!!" });
            }
        }
        
    }
}
