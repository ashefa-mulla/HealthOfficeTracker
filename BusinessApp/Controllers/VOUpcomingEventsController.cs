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
using BusinessService.Custom.VOUpcomingEvents;
using AutoMapper;


namespace BusinessApp.Controllers
{
    [EnableCors("AllowOriginVO"), Route("api/[controller]")]
    [ApiController]
    public class VOUpcomingEventsController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<VOUpcomingEventsController> Logger;
        private readonly IVOUpcomingEventsService _voupcomingEventsService;
        public VOUpcomingEventsController(IMapper _mapper, ILogger<VOUpcomingEventsController> _logger, IUserService _userServices, IVOUpcomingEventsService voupcomingEventsService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _voupcomingEventsService = voupcomingEventsService;

        }
        [HttpGet("GetVOUpcomingEvents/{id}")]
        public async Task<ActionResult<VOUpcomingEventsModel>> Get(int id)
        {
            try
            {
                VOUpcomingEventsModel model = new VOUpcomingEventsModel();
                var result = await _voupcomingEventsService.Get(id);

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
        [HttpGet("GetAllVOUpcomingEvents")]
        public async Task<ActionResult<GetVOUpcomingEvents_Result>> GetVOUpcomingEvents()
        {
            try
            {
                var result = await _voupcomingEventsService.GetVOUpcomingEvents();

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
        [HttpPost("addeditEvents")]
        public async Task<ActionResult<VOUpcomingEventsModel>> AddEditEvents(VOUpcomingEventsModel model)
        {
            try
            {
                bool isResult = false;
                TblVoupcomingEvents obj = Mapper.Map<VOUpcomingEventsModel, TblVoupcomingEvents>(model);
                if (obj.Id != 0)
                {
                    isResult = await _voupcomingEventsService.tblupdate(obj);
                }
                else
                {
                    isResult = await _voupcomingEventsService.tblinsert(obj);
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
        [HttpDelete("deleteEvents/{id:int}")]
        public async Task<ActionResult> DeleteEvents(int id)
        {
            try
            {
                var result = await _voupcomingEventsService.tbldelete(id);
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
