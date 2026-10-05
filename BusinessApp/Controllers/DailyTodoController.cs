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
using AutoMapper;
using BusinessService.Custom.DailyToDo;
using BusinessService.Custom.PunchDetail;
using BusinessService.Custom.Employee;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DailyTodoController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        private readonly IDailyToDoService _DailyToDoService;
        public readonly IPunchDetailService _PunchDetailservice;
        private readonly IEmployeeService _EmployeeService;
        private readonly ApplicationSettings appSettings;
        public DailyTodoController(IOptions<ApplicationSettings> _appSettings, IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, IDailyToDoService DailyToDoService, IPunchDetailService PunchDetailservice, IEmployeeService EmployeeService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _DailyToDoService = DailyToDoService;
            _PunchDetailservice = PunchDetailservice;
            _EmployeeService = EmployeeService;
            appSettings = _appSettings.Value;
        }

        private long ToUnixTimespan(DateTime date)
        {
            TimeSpan tspan = date.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0));
            return (long)Math.Truncate(tspan.TotalSeconds);
        }

        [HttpGet("GetDailyEvents")]
        public async Task<ActionResult<GetPunchDetailTodoByEmpID_Result>> GetDailyEvents(DateTime start, DateTime end, string s_mm, string s_yy,int empid,int callid)
        {
            try
            {
                //if (s_mm != null)
                //{
                //    string ls_fdate = s_mm + "/01/" + s_yy;
                //    string ls_edate = "";
                //    DateTime ld_fdate = Convert.ToDateTime(ls_fdate);
                //    int ls_days = DateTime.DaysInMonth(Convert.ToInt32(s_yy), Convert.ToInt32(s_mm));
                //    ls_edate = s_mm + "/" + Convert.ToString(ls_days) + "/" + s_yy;
                //    DateTime ld_edate = Convert.ToDateTime(ls_edate);
                //    //start = Convert.ToDouble(ToUnixTimespan(ld_fdate));
                //    //end = Convert.ToDouble(ToUnixTimespan(ld_edate));
                //}
                DateTime fromDate = start;
                DateTime toDate = end;
                var result = await _DailyToDoService.GetPunchDetailTodoByEmpID(fromDate, toDate, empid);
                var eventList = from e in result
                                select new
                                {
                                    id = e.ID,
                                    aid = e.Employee_ID,
                                    title = empid == 0 || callid == 1 ? e.fullname + ": " + e.ToDoDetail: e.ToDoDetail,
                                    title2 = e.ToDoDetail,
                                    start = e.shift_dt.ToString(),
                                    end = e.shift_dt.ToString(),
                                    //className = e.FollowupDate,
                                };

                if (eventList != null)
                    return Ok(eventList.ToList());
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        private DateTime ConvertFromUnixTimestamp(double timestamp)
        {
            var origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return origin.AddSeconds(timestamp);
        }

        [HttpGet("GetDailySummary")]
        public async Task<ActionResult<GetPunchDetailTodoByEmpID_Result>> GetDailySummary(string start, string end,int empid)
        {
            try
            {
                DateTime fromDate = ConvertFromUnixTimestamp(Convert.ToDouble(start));
                DateTime toDate = ConvertFromUnixTimestamp(Convert.ToDouble(end));

                var result = await _DailyToDoService.GetPunchDetailTodoByEmpID(fromDate, toDate, empid);
                var eventList = from e in result
                                select new
                                {
                                    id = e.ID,
                                    aid = e.Employee_ID,
                                    title = e.ToDoDetail,
                                    title2 = e.ToDoDetail,
                                    start = e.shift_dt.ToString(),
                                    end = e.shift_dt.ToString(),
                                    //className = e.FollowupDate,
                                    allDay = false
                                };

                if (eventList != null)
                    return Ok(eventList.ToList());
                else
                    return NotFound();
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("GetTodo/{id}")]
        public async Task<ActionResult<TblPunchDetailTodo>> Get(int id)
        {
            try
            {
                PunchDetailTodo model = new PunchDetailTodo();
                TblPunchDetailTodo trackertask = await _DailyToDoService.Get(id);
                if(id>0)
                model = Mapper.Map<PunchDetailTodo>(trackertask);

                if (model != null)
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
        [HttpPost("AddEditTodo")]
        public async Task<ActionResult<TblToptrackerTask>> AddEditTodo(PunchDetailTodo model)
        {
            try
            {
                bool Result = false;
                IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                IEnumerable<GetPuncDetailTodoIDForTodo_Result> punchdetailid = await _DailyToDoService.GetPuncDetailTodoIDForTodo(datetimenowList[0].ServerTime, model.EmployeeID);
                List<GetPuncDetailTodoIDForTodo_Result> punchdetailidlist = punchdetailid.ToList();
                TblPunchDetailTodo punchdetail = Mapper.Map<TblPunchDetailTodo>(model);
                if (punchdetailidlist.Count > 0 && model.ID >0)
                {
                    punchdetail.Id = punchdetailidlist.Where(x => x.ID == model.ID).Select(y=>y.ID).FirstOrDefault();
                    Result = await _DailyToDoService.tblupdate(punchdetail);

                    if (model.EmailSent == true)
                    {
                        TblEmployer emp = await _EmployeeService.Get(model.EmployeeID);
                        //TO DO: Krishna M / Date
                        string ls_email = emp.PrimaryEmail;//AppSession.UserName;
                        string body1 = "";

                        Result = false;
                        if (emp.Id > 0)
                        {
                            body1 = "";
                            body1 = "<p>Dr Patel/Anjan/Aisha,</p>" + "<p>TO DO: </p>" +
                            "<p>" + model.ToDoDetail + "</p>" +
                            "<br><p style=" + "color:red;" + ">Note: This electronic mail automatically generated from a computer.</p>";

                            if (Convert.ToBoolean(appSettings.SendEmail))
                            {
                                string body = body1;
                                string subject = "To Do: " + emp.Firstname + ' ' + emp.Lastname[0] + " Date: " + datetimenowList[0].ServerTime.ToString("MM/dd/yyyy");
                                SendmailAsync(appSettings.SMTPEmail, appSettings.SMTPCC, ls_email, subject, body);
                                Result = true;
                            }
                        }
                    }
                }
                else
                {
                    Result = await _DailyToDoService.tblinsert(punchdetail);

                    if (model.EmailSent == true)
                    {
                        TblEmployer emp = await  _EmployeeService.Get(model.EmployeeID);
                        //TO DO: Krishna M / Date
                        string ls_email = "";//AppSession.UserName;
                        string body1 = "";

                        Result = false;
                        if (emp.Id > 0)
                        {
                            body1 = "";
                            body1 = "<p>Dr Patel/Anjan/Aisha,</p>" +
                            "<p>" + model.ToDoDetail + "</p>" +
                            "<p>Note: This electronic mail automatically generated from a computer.</p>";

                            if (Convert.ToBoolean(appSettings.SendEmail))
                            {
                                string body = body1;
                                string subject = "To Do: " + emp.Firstname + ' ' + emp.Lastname[0] + " Date: " + datetimenowList[0].ServerTime.ToString("MM/dd/yyyy");
                                SendmailAsync(appSettings.SMTPEmail, appSettings.SMTPCC, ls_email, subject, body);
                                Result = true;
                            }
                        }
                    }
                    
                }
                if (Result)
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
        public void SendmailAsync(string EmailTo, string EmailCc, string EmailFrom, string EmailSubject, string EmailBody, List<string> lstattachment = null)
        {
            EmailUtility response = new EmailUtility();
            string key = appSettings.SendGridAPIkey;

            response.SendMail(key, EmailTo, EmailCc, EmailFrom, EmailSubject, EmailBody, lstattachment).Wait();
        }
        //daily task get from tasklist
        [HttpGet("GetDailyTask/{id}")]
        public async Task<ActionResult<sp_gettodotasklist_Result>> GetTodotasklist(int Id)
        {
            try
            {
                var result = await _DailyToDoService.GetTodotasklist(Id);

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

        //daily task get from tasklist
        [HttpGet("getdailytaskforall")]
        public async Task<ActionResult<sp_gettasklistforall_Result>> Gettasklistforall()
        {
            try
            {
                var result = await _DailyToDoService.Gettasklistforall();

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