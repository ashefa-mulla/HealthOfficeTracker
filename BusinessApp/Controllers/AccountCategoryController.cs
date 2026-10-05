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
using AutoMapper;

namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class AccountCategoryController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<AccountCategoryController> Logger;
        private readonly IAccountCategoryService _accountCategoryService;

        public AccountCategoryController(IMapper _mapper, ILogger<AccountCategoryController> _logger, IUserService _userServices,
                                         IAccountCategoryService accountCategoryService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _accountCategoryService = accountCategoryService;

        }

        [HttpGet("GetCategory/{id}")]
        public async Task<ActionResult<AccountCategory>> Get(int id)
        {
            try
            {
                AccountCategory model = new AccountCategory();
                var result = await _accountCategoryService.Get(id);

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
        [HttpGet("GetAllAccountCategoryList")]
        public async Task<ActionResult<GetAllAccountCategory_Result>> GetAllAccountCategoryList()
        {
            try
            {
                var result = await _accountCategoryService.GetAllAccountCategory();

                if (result != null)
                {
                    return Ok(result);
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

        [HttpGet("GetAccountCategory")]
        public async Task<ActionResult<GetAllAccountCategory_Result>> GetAllAccountCategory()
        {
            try
            {
                var result = await _accountCategoryService.GetAllAccountCategory();

                if (result != null)
                {
                    List<GetAllAccountCategory_Result> results = new List<GetAllAccountCategory_Result>();
                    results.Add(new GetAllAccountCategory_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetAllAccountCategory_Result { Name = d.Name, ID = d.ID }).ToList());
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
        [HttpPost("addeditAccountCategory")]
        public async Task<ActionResult<AccountCategory>> AddEditAccountCategory(AccountCategory model)
        {
            try
            {
                bool isResult = false;
                TblAccountCategory obj = Mapper.Map<AccountCategory, TblAccountCategory>(model);
                if (obj.Id != 0)
                {
                    isResult = await _accountCategoryService.tblupdate(obj);
                }
                else
                {
                    isResult = await _accountCategoryService.tblinsert(obj);
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
        [HttpDelete("deleteaccountaategory/{id:int}")]
        public async Task<ActionResult> DeleteAccountCategory(int id)
        {
            try
            {
                var result = await _accountCategoryService.tbldelete(id);
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