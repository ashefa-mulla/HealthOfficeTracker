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
using BusinessService.Custom.Notification;
using SendGrid.Helpers.Errors;
using Newtonsoft.Json.Serialization;
using System.Net;
using System.Net.Sockets;
using Microsoft.AspNetCore.Http;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PunchDetailController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<TrackerProjectController> Logger;
        private readonly IDailyToDoService _DailyToDoService;
        public readonly IPunchDetailService _PunchDetailservice;
        private readonly IEmployeeService _EmployeeService;
        private readonly ApplicationSettings appSettings;
        private readonly INotificationService _NotificationService;
        public PunchDetailController(IOptions<ApplicationSettings> _appSettings, IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, IDailyToDoService DailyToDoService, IPunchDetailService PunchDetailservice, IEmployeeService EmployeeService, INotificationService NotificationService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _DailyToDoService = DailyToDoService;
            _PunchDetailservice = PunchDetailservice;
            _EmployeeService = EmployeeService;
            _NotificationService = NotificationService;
            appSettings = _appSettings.Value;
        }

        [HttpGet("GetCompanyBranchListByCompanyID/{companyid}")]
        public async Task<ActionResult<GetCompanyBranchListByCompanyID_Result>> GetCompanyBranchListByCompanyID(int companyid)
        {
            try
            {
                PunchDetail model = new PunchDetail();
                var offset = await _PunchDetailservice.GetCompanyBranchListByCompanyID(companyid);
                GetCompanyBranchListByCompanyID_Result asList = offset.FirstOrDefault();
                model.Offset = Convert.ToInt32(asList.Offset);
                model.TimeZone = asList.time_zone_time;
                model.Branch = asList.ID;
                model.IsWebCam = true;
                if (model != null)
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

        [HttpGet("GetUserInOutvalue/{userid}")]
        public async Task<ActionResult<GetEmployeeByUserID_Result>> GetUserInOutvalue(int userid)
        {
            try
            {
                var result = await _EmployeeService.GetEmployeeByUserID(userid);
                GetEmployeeByUserID_Result emplist = result.FirstOrDefault();
                var data = await _PunchDetailservice.GetPunchIDForClockOut(emplist.ID);
                GetPunchIDForClockOut_Result list = data.FirstOrDefault();
                return Ok(list);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpGet("GetUserLogWithCaptureImg")]
        public async Task<ActionResult<GetUserLogWithCaptureImg_Result>> GetUserLogWithCaptureImg()
        {
            try
            {
                var result = await _PunchDetailservice.GetUserLogWithCaptureImg();
                return Ok(result);
            }
            catch (Exception ex)
            {

                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }
        [HttpPost("AddEditPunchDetail")]
        public async Task<ActionResult<PunchDetail>> AddEditPunchDetail(PunchDetail model)
        {
            try
            {
                bool isResult = false;
                TblPunchDetail obj = Mapper.Map<PunchDetail, TblPunchDetail>(model);
                IEnumerable<GetEmployeeByUserID_Result> employelist = await _EmployeeService.GetEmployeeByUserID(model.UserID);
                GetEmployeeByUserID_Result emplist = employelist.FirstOrDefault();
                if (employelist.Count() > 0)
                {

                    TblUserMaster data = await userServices.Get(model.UserID);
                    string captureurl = "";
                    //if (AppSession.CapturedImage != null)
                    //{
                    //    captureurl = AppSession.CapturedImage;
                    //    AppSession.CapturedImage = null;
                    //    model.PIN = data.Pin;
                    //    model.CaptureImg = captureurl;
                    //}
                    if (data.Pin == model.PIN)
                    {
                        if (model.Latitude != null && model.Longitude != null)
                        {
                            IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                            List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                            string ipaddress = null;
                            string header = (Request.Headers["HTTP_X_FORWARDED_FOR"].FirstOrDefault());
                            if(IPAddress.TryParse(header, out IPAddress ip))
                            {
                                ipaddress = ip.ToString();

                               
                            }
                            if (ipaddress == "" || ipaddress == null)
                                ipaddress = Request.HttpContext.Connection.LocalIpAddress.ToString();


                            model.IpAddIn = ipaddress.ToString();

                            model.EmployeeId = emplist.ID;
                            model.CreatedDate = datetimenowList[0].ServerTime;
                            model.UpdatedDate = datetimenowList[0].ServerTime;
                            model.ShiftDt = datetimenowList[0].ServerTime;
                            model.ShiftStartTime = datetimenowList[0].ServerTime;
                            model.EventId = 1;
                            model.Branch = 1;

                            TblPunchDetail punchdetail = Mapper.Map<PunchDetail, TblPunchDetail>(model);

                            IEnumerable<GetPunchIDForClockOut_Result> offset = await _PunchDetailservice.GetPunchIDForClockOut(emplist.ID);
                            List<GetPunchIDForClockOut_Result> asList = offset.ToList();

                            if (asList.Count > 0)
                            {
                                TblPunchDetail punchdtl = await _PunchDetailservice.Get(asList[0].ID);
                                punchdtl.ShiftEndTime = model.ShiftStartTime;
                                punchdtl.UpdatedDate = datetimenowList[0].ServerTime;
                                punchdtl.IpAddOut = model.IpAddIn;
                                punchdtl.OutCaptureImg = captureurl;
                                isResult = await _PunchDetailservice.tblupdate(punchdtl);

                                IEnumerable<GetNotificationDetailByUserID_Result> notidtl = await _NotificationService.GetNotificationDetailByUserID(model.UserID);
                                List<GetNotificationDetailByUserID_Result> notidtlasList = notidtl.ToList();
                                if (notidtlasList.Count > 0)
                                {
                                    isResult = false;
                                    TblNotification notification = new TblNotification();
                                    notification.Id = notidtlasList[0].ID;
                                    notification.Text = notidtlasList[0].Text;
                                    notification.ExecDate = notidtlasList[0].ExecDate;
                                    notification.OutDate = datetimenowList[0].ServerTime;
                                    notification.IsYesNo = notidtlasList[0].IsYesNo;
                                    notification.IsRead = notidtlasList[0].IsRead;
                                    notification.InsertedDate = notidtlasList[0].InsertedDate;
                                    notification.UserId = model.UserID;
                                    isResult = await _NotificationService.tblupdate(notification);

                                }
                                if (isResult)
                                {
                                    return Ok(new { message =  "Clocked-Out successfully." });
                                }
                                else
                                {
                                    return BadRequest(new { message = "Clocked-Out Not successfully" });
                                }
                            }
                            else
                            {
                                isResult = await _PunchDetailservice.tblinsert(punchdetail);
                                TblEmployer emp = await _EmployeeService.Get(emplist.ID);
                                if (isResult == true)
                                {
                                    isResult = false;
                                    TblNotification notification = new TblNotification();
                                    notification.Text = emp.Lastname + " " + emp.Firstname;
                                    notification.ExecDate = datetimenowList[0].ServerTime;
                                    notification.IsYesNo = true;
                                    notification.IsRead = false;
                                    notification.InsertedDate = datetimenowList[0].ServerTime;
                                    notification.UserId = model.UserID;

                                    isResult = await _NotificationService.tblinsert(notification);
                                    //}
                                }
                                if (isResult)
                                {
                                    return Ok(new { message = "Clocked-In successfully." });
                                }
                                else
                                {
                                    return BadRequest(new { message = "Clocked-In Not successfully" });
                                }
                            }
                        }
                        else
                        {
                            return NotFound(new { message = "Please allowed location to your device." });
                        }
                    }
                    else
                    {
                        return BadRequest(new { message = "User PIN is incorrect." });
                    }
                }
                else
                {
                    return BadRequest(new { message = "Please enter your valid user code." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : {ex}");
            }
            return BadRequest();
        }

        [HttpPost("clockinout")]
        public async Task<ActionResult<UserClockInModel>> ClockedInOut(UserClockInModel model)
        {
            try
            {
                bool isResult = false;
                //TblUserMaster data = await userServices.Get(model.UserId);
                //if (data.Pin == model.Pin)
                //{
                    IEnumerable<GetDateTimeForClockInOut_Result> datetimenow = await _PunchDetailservice.GetDateTimeForClockInOut();
                    List<GetDateTimeForClockInOut_Result> datetimenowList = datetimenow.ToList();
                    IEnumerable<GetPunchIDForClockOut_Result> offset = await _PunchDetailservice.GetPunchIDForClockOut(model.EmployeeId);
                    List<GetPunchIDForClockOut_Result> asList = offset.ToList();
                    if (asList.Count > 0)
                    {
                        TblPunchDetail obj = await _PunchDetailservice.Get(asList[0].ID);
                        obj.ShiftEndTime = datetimenowList[0].ServerTime;
                        obj.UpdatedDate = datetimenowList[0].ServerTime;
                        obj.IpAddOut = model.IpAddress;
                        //obj.OutCaptureImg = captureurl;
                        isResult = await _PunchDetailservice.tblupdate(obj);

                        IEnumerable<GetNotificationDetailByUserID_Result> notidtl = await _NotificationService.GetNotificationDetailByUserID(model.UserId);
                        List<GetNotificationDetailByUserID_Result> notidtlasList = notidtl.ToList();
                        if (notidtlasList.Count > 0)
                        {
                            isResult = false;
                            TblNotification notification = new TblNotification();
                            notification.Id = notidtlasList[0].ID;
                            notification.Text = notidtlasList[0].Text;
                            notification.ExecDate = notidtlasList[0].ExecDate;
                            notification.OutDate = datetimenowList[0].ServerTime;
                            notification.IsYesNo = notidtlasList[0].IsYesNo;
                            notification.IsRead = notidtlasList[0].IsRead;
                            notification.InsertedDate = notidtlasList[0].InsertedDate;
                            notification.UserId = model.UserId;
                            isResult = await _NotificationService.tblupdate(notification);

                        }
                        if (isResult)
                        {
                            return Ok(new { message = "Clocked-Out successfully." });
                        }
                        else
                        {
                            return BadRequest(new { message = "Clocked-In/Out error!!" });
                        }
                    }
                    else
                    {
                        TblPunchDetail obj = new TblPunchDetail();
                        obj.IpAddIn = model.IpAddress;

                        obj.EmployeeId = model.EmployeeId;
                        obj.CreatedDate = datetimenowList[0].ServerTime;
                        obj.UpdatedDate = datetimenowList[0].ServerTime;
                        obj.ShiftDt = DateOnly.FromDateTime(datetimenowList[0].ServerTime);
                        obj.ShiftStartTime = datetimenowList[0].ServerTime;
                        obj.EventId = 1;
                        obj.Branch = 1;
                        obj.Location = model.DeviceName;
                        obj.Longitude = "0";
                        obj.Latitude = "0";

                        isResult = await _PunchDetailservice.tblinsert(obj);
                        if (isResult == true)
                        {
                            isResult = false;
                            TblNotification notification = new TblNotification();
                            notification.Text = model.UserName;
                            notification.ExecDate = datetimenowList[0].ServerTime;
                            notification.IsYesNo = true;
                            notification.IsRead = false;
                            notification.InsertedDate = datetimenowList[0].ServerTime;
                            notification.UserId = model.UserId;

                            isResult = await _NotificationService.tblinsert(notification);

                        }
                        if (isResult)
                        {
                            return Ok(new { message = "Clocked-In successfully." });
                        }
                        else
                        {
                            return BadRequest(new { message = "Clocked-In/Out error!!" });
                        }
                    }


                //}
                //else
                //{
                //    return BadRequest(new { message = "User PIN is incorrect." });
                //}
            }
            catch (Exception e)
            {
                Logger.LogError($"Error - : {e}");
            }
            return BadRequest(new { message = "Clocked-In/Out error!!" }); 
        }
    }
}