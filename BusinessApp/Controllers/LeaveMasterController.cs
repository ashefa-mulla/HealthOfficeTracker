using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using BusinessData.DataContext;
using BusinessService.Custom.User;
using BusinessService.Custom.LeaveMaster;
using BusinessApp.Models;
using Microsoft.Extensions.Logging;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveMasterController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILeaveMasterService leaveMasterService;
        private readonly ILogger<TrackerProjectController> Logger;
        public LeaveMasterController(IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, ILeaveMasterService _leaveMasterService)
        {
            Mapper = _mapper;
            userServices = _userServices;
            Logger = _logger;
            leaveMasterService = _leaveMasterService;
        }

        [HttpGet("GetLeaveMaster/{id}")]
        public async Task<ActionResult<LeaveMaster>> Get(int id)
        {
            try
            {
                LeaveMaster model = new LeaveMaster();
                var result = await leaveMasterService.Get(id);

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
        [HttpGet("GetAllLeave")]
        public async Task<ActionResult<GetLeaveMasterList_Result>> GetAllLeave()
        {
            try
            {
                var result = await leaveMasterService.GetLeaveMasterList();
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
        [HttpGet("GetLeaveMasterListbyEmpID/{empid}")]
        public async Task<ActionResult<GetLeaveMasterList_Result>> GetLeaveMasterListbyEmpID(int empid)
        {
            try
            {
                var result = await leaveMasterService.GetLeaveMasterListbyEmpID(empid);
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


        [HttpPost("AddEditLeave")]
        public async Task<ActionResult<LeaveMaster>> AddEditLeave(LeaveMaster model)
        {
            try
            {
                bool isResult = false;
                TblLeaveMaster obj = Mapper.Map<LeaveMaster, TblLeaveMaster>(model);
                if (obj.Id != 0)
                {
                    obj.UpdatedDate = System.DateTime.Now;
                    isResult = await leaveMasterService.tblupdate(obj);
                }
                else
                {
                    obj.UpdatedDate = System.DateTime.Now;
                    isResult = await leaveMasterService.tblinsert(obj);
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

        [HttpDelete("deleteLeave/{id:int}")]
        public async Task<ActionResult> DeleteLeave(int id)
        {
            try
            {
                var result = await leaveMasterService.tbldelete(id);
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