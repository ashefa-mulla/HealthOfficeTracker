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
using BusinessService.Custom.ChequeRequest;
using AutoMapper;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class ChequeRequestController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<ChequeRequestController> Logger;
        private readonly IChequeRequestService _chequerequestService;
        private readonly ApplicationSettings appSettings;
        public ChequeRequestController(IOptions<ApplicationSettings> _appSettings, IMapper _mapper, ILogger<ChequeRequestController> _logger, IUserService _userServices, IChequeRequestService chequerequestService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _chequerequestService = chequerequestService;
            appSettings = _appSettings.Value;

        }
        [HttpGet("GetCheck/{id}")]
        public async Task<ActionResult<ChequeRequestModel>> Get(int id)
        {
            try
            {
                ChequeRequestModel model = new ChequeRequestModel();
                var result = await _chequerequestService.Get(id);

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

        [HttpGet("GetAllChequeRequest")]
        public async Task<ActionResult<GetAllChequeRequest_Result>> GetAllChequeRequest()
        {
            try
            {
                var result = await _chequerequestService.GetAllChequeRequest();

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
        [HttpPost("addeditChequeRequest")]
        public async Task<ActionResult<ChequeRequestModel>> AddEditCheck(ChequeRequestModel model)
        {
            try
            {
                bool isResult = false;
                string body1 = "";
                string body2 = "";
                string body3 = "";
                string body = "";
                body1 = "<p>Anjan,</p>" +
                "<table border=" + "1px" + " width=" + "100%" + " style=" + "border-collapse:collapse;border-color:Black" + "><thead style=" + "border-collapse:collapse;border-color:black" + "><tr style=" + "border:solid;border-color:black" + ">" +
                "<th width=" + "10%" + " style=" + "border-collapse:collapse;border-color:black" + ">Request Date</th>" +
                "<th width=" + "10%" + " style=" + "border-collapse:collapse;border-color:black" + ">PayTo</th>" +
                "<th width=" + "40%" + " style=" + "border-collapse:collapse;border-color:black" + ">Memo</th>" +
                "<th width=" + "30%" + " style=" + "border-collapse:collapse;border-color:black" + ">Address</th>" +
                "<th width=" + "30%" + " style=" + "border-collapse:collapse;border-color:black" + ">Amount</th></tr></thead>" +
                "<tbody>";
                foreach (var dt in model.ChequeRequest)
                {
                    dt.BankId = model.bankId;
                    dt.Id= model.id;
                    TblChequeRequest obj = Mapper.Map<ChequeRequest, TblChequeRequest>(dt);
                    if (obj.Id != 0)
                    {

                        isResult = await _chequerequestService.tblupdate(obj);
                    }
                    else
                    {
                        isResult = await _chequerequestService.tblinsert(obj);
                        string dtformate = obj.RequestDate.ToString("MM/dd/yyyy");
                        body2 += "<tr><td  width=" + "10%" + " style=" + "border-collapse:collapse;border-color:black" + ">" + dtformate + "" +
                              "</td><td width=" + "10%" + " style=" + "border-collapse:collapse;border-color:black" + ">" + obj.PayTo + "</td><td width=" + "40%" + " style=" + "Text-align:Left" + " style=" + "border-collapse:collapse;border-color:black" + ">" + obj.Memo + "</td><td width=" + "30%" + " style=" + "border-collapse:collapse;border-color:black" + ">" + obj.Address + "</td><td width=" + "30%" + " style=" + "border-collapse:collapse;border-color:black" + ">" + obj.Amount + "</td></tr></table>";
                    }
                    if (isResult)
                    {
                        body = body1 + body2;
                        string subject = "Cheque Request: " + " Date: " + System.DateTime.Now.ToString("MM/dd/yyyy");
                        SendmailAsync(appSettings.SMTPEmailChequeRequest,appSettings.SMTPCC,model.currentUser, subject, body);
                    }
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

        public void SendmailAsync(string EmailTo, string EmailCc, string EmailFrom, string EmailSubject, string EmailBody, List<string> lstattachment = null)
        {
            EmailUtility response = new EmailUtility();
            string key = appSettings.SendGridAPIkey;

            response.SendMail(key, EmailTo, EmailCc, EmailFrom, EmailSubject, EmailBody, lstattachment).Wait();
        }
        [HttpDelete("deleteChequeRequest/{id:int}")]
        public async Task<ActionResult> DeleteCheck(int id)
        {
            try
            {
                var result = await _chequerequestService.tbldelete(id);
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
    }
}