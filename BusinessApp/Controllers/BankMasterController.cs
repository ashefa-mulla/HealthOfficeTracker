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
using BusinessService.Custom.BankMaster;
using AutoMapper;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class BankMasterController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<BankMasterController> Logger;
        private readonly IBankMasterService _bankMasterService;
        public BankMasterController(IMapper _mapper, ILogger<BankMasterController> _logger, IUserService _userServices,IBankMasterService bankMasterService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _bankMasterService = bankMasterService;

        }
        [HttpGet("GetBankMaster/{id}")]
        public async Task<ActionResult<BankMasterModel>> Get(int id)
        {
            try
            {
                BankMasterModel model = new BankMasterModel();
                var result = await _bankMasterService.Get(id);

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

        [HttpGet("GetAllBankMaster")]
        public async Task<ActionResult<GetAllBankDetail_Result>> GetAllbankMaster()
        {
            try
            {
                var result = await _bankMasterService.GetAllBankMaster();

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
        [HttpPost("addeditBankMaster")]
        public async Task<ActionResult<BankMasterModel>> AddEditbankMaster(BankMasterModel model)
        {
            try
            {
                bool isResult = false;
                TblBankMaster obj = Mapper.Map<BankMasterModel, TblBankMaster>(model);
                if (obj.Id != 0)
                {
                    isResult = await _bankMasterService.tblupdate(obj);
                }
                else
                {
                    isResult = await _bankMasterService.tblinsert(obj);
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
        [HttpDelete("deleteBankMaster/{id:int}")]
        public async Task<ActionResult> DeletebankMaster(int id)
        {
            try
            {
                var result = await _bankMasterService.tbldelete(id);
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

        [HttpGet("GetAllBankList")]
        public async Task<ActionResult<GetAllBankList_Result>> GetAllBankList()
        {
            try
            {
                var result = await _bankMasterService.GetAllBankList();

                if (result != null)
                {
                    List<GetAllBankList_Result> results = new List<GetAllBankList_Result>();
                    results.Add(new GetAllBankList_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetAllBankList_Result { Name = d.Name, ID = d.ID }).ToList());
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
    }
}