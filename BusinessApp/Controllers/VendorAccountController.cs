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
using BusinessService.Custom.AccountCategory;
using BusinessService.Custom.VendorAccount;
using AutoMapper;
using BusinessService.Custom.VendorAccountNumber;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class VendorAccountController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<VendorAccountController> Logger;
        private readonly IVendorAccountService _vendoraccountService;
        private readonly IVendorAccountNumberService _vendoraccountnumberService;

        public VendorAccountController(IMapper _mapper, ILogger<VendorAccountController> _logger, IUserService _userServices,
                                         IVendorAccountService vendoraccountService,IVendorAccountNumberService vendoraccountnumberService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _vendoraccountService = vendoraccountService;
            _vendoraccountnumberService = vendoraccountnumberService;

        }
        //[HttpGet("GetVendorAccounts/{id}")]
        // public async Task<ActionResult<VendorAccountModel>> Get(int id)
        // {
        //     try
        //     {
        //         VendorAccountModel model = new VendorAccountModel();
        //         var result = await _vendoraccountService.Get(id);

        //         if (result != null)
        //             return Ok(result);
        //         else
        //             return Ok(model);
        //     }
        //     catch (Exception ex)
        //     {

        //         Logger.LogError($"Error: {ex}");
        //         return BadRequest();
        //     }

        // }

        [HttpGet("GetVendorAccounts/{id}")]
        public async Task<ActionResult<VendorAccountModel>> Get(int id)
        {
            try
            {
                var result = await _vendoraccountService.Get(id);

                if (result == null)
                    return Ok(new VendorAccountModel());

                // ⭐ MAP ENTITY TO MODEL
                var model = Mapper.Map<VendorAccountModel>(result);

                // ⭐ VERY IMPORTANT (avoid frontend crash)
                model.tblVandorAccountNumber ??= new List<VandorAccountNumber>();

                return Ok(model);
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error: {ex}");
                return BadRequest();
            }
        }


        [HttpGet("GetAllVendorAccount")]
        public async Task<ActionResult<GetAllVandorAccount_Result>> GetAllVendorAccount()
        {
            try
            {
                var result = await _vendoraccountService.GetAllVendorAccount();

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

        [HttpGet("GetAllVendorAccountbyCategoryID/{cid}")]
        public async Task<ActionResult<GetAllVandorAccount_Result>> GetAllVendorAccount(int cid)
        {
            try
            {
                var result = await _vendoraccountService.GetVendorAccountByCategoryID(cid);

                if (result != null)
                {
                    List<GetAllVandorAccount_Result> results = new List<GetAllVandorAccount_Result>();
                    results.Add(new GetAllVandorAccount_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetAllVandorAccount_Result { Name = d.Name, ID = d.ID }).ToList());
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

        [HttpPost("addeditvendoraccount")]
        public async Task<ActionResult<VendorAccountModel>> AddEditVendorAccount(VendorAccountModel model)
        {
            try
            {
                bool isResult = false;
                int vid = 0;
                TblVandorAccount obj = Mapper.Map<TblVandorAccount>(model);

                //Mapper.Map<VendorAccountModel, TblVandorAccount>(model);
                if (obj.Id != 0)
                {
                    isResult = await _vendoraccountService.tblupdate(obj);                    
                }
                else
                {
                    vid = await _vendoraccountService.tblinsert(obj);
                }
                if(model.tblVandorAccountNumber != null)
                { 
                if (model.tblVandorAccountNumber.Count > 0)
                {
                    foreach (var dt in model.tblVandorAccountNumber)
                    {
                        TblVandorAccountNumber obj1 = Mapper.Map<VandorAccountNumber, TblVandorAccountNumber>(dt);
                        obj1.VandorAccountId = vid;
                        if(obj.Id>0)
                        {
                            obj1.VandorAccountId = obj.Id;
                        }

                            //if (obj1.Id>0)
                            //{
                            //    int don = await _vendoraccountnumberService.tblupdate(obj1);
                            //}
                            //else
                            //{
                            //    isResult = await _vendoraccountnumberService.tblinsert(obj1);
                            //}
                            if (obj1.Id > 0)
                            {
                                int don = await _vendoraccountnumberService.tblupdate(obj1);
                                isResult = true;   // ⭐ ADD THIS
                            }
                            else
                            {
                                isResult = await _vendoraccountnumberService.tblinsert(obj1);
                            }
                        }
                }
                }
                else
                {
                    return Ok();
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

        [HttpDelete("deletevendoraccount/{id:int}")]
        public async Task<ActionResult> DeleteVendorAccount(int id)
        {
            try
            {
                var result = await _vendoraccountService.DeActivateVendorAccount(id);
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


        //Vendor Account Number

        [HttpGet("GetVendorAccountNumberByVendorID/{vid}")]
        public async Task<ActionResult<GetVendorAccountNumberByVendorID_Result>> GetVendorAccountNumberByVendorID(int vid)
        {
            try
            {
                var result = await _vendoraccountnumberService.GetVendorAccountNumberByVendorID(vid);

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
        [HttpPost("addeditGetVendorAccountNumber")]
        public async Task<ActionResult<VandorAccountNumber>> addeditGetVendorAccountNumber(VandorAccountNumber model)
        {
            try
            {
                bool isResult = false;
                TblVandorAccountNumber obj = Mapper.Map<VandorAccountNumber, TblVandorAccountNumber>(model);
                isResult = await _vendoraccountnumberService.tblinsert(obj);
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

    }
}
