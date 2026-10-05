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
using BusinessService.Custom.LeaveTransaction;
using BusinessApp.Models;
using Microsoft.Extensions.Logging;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveTransactionController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILeaveMasterService leaveMasterService;
        private readonly ILeaveTransactionService leaveTransactionService;
        private readonly ILogger<TrackerProjectController> Logger;
        public LeaveTransactionController(IMapper _mapper, ILogger<TrackerProjectController> _logger, IUserService _userServices, ILeaveMasterService _leaveMasterService, ILeaveTransactionService _leaveTransactionService)
        {
            Mapper = _mapper;
            userServices = _userServices;
            Logger = _logger;
            leaveMasterService = _leaveMasterService;
            leaveTransactionService = _leaveTransactionService;
        }


        [HttpGet("GetLeaveTransaction/{id}")]
        public async Task<ActionResult<LeaveTransaction>> Get(int id)
        {
            try
            {
                LeaveTransaction model = new LeaveTransaction();
                var result = await leaveTransactionService.Get(id);

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
        [HttpGet("GetLeaveEmployeeTransactionList")]
        public async Task<ActionResult<GetLeaveTransactionList_Result>> GetLeaveEmployeeTransactionList()
        {
            try
            {
                var result = await leaveTransactionService.GetLeaveEmployeeTransactionList();
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
        [HttpGet("GetLeaveTransactionList")]
        public async Task<ActionResult<GetLeaveTransactionList_Result>> GetLeaveTransactionList(int empid, int month, int year,bool currentyear)
        {
            try
            {
                var result = (dynamic)null;
                if (empid != 0)
                {
                    result = await leaveTransactionService.GetLeaveTransactionList(empid, month, year, currentyear);
                }
                else
                {
                    result = await leaveTransactionService.GetLeaveTransactionList(0, month, year, currentyear);
                }

                
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

        [HttpPost("AddEditLeaveTransaction")]
        public async Task<ActionResult<LeaveTransaction>> AddEditLeaveTransaction(LeaveTransaction model)
        {
            try
            {

                bool isResult = false;
                TblLeaveTransaction obj = Mapper.Map<LeaveTransaction, TblLeaveTransaction>(model);
                obj.Month = model.FromDate.Month;
                obj.Year = model.FromDate.Year;
                obj.Leaves = Convert.ToDecimal(model.Leaves);
                obj.Pl = Convert.ToDecimal(model.PLeaves);
                obj.Lwp = Convert.ToDecimal(model.LWP);
                if(model.isSickLeaves)
                { 
                obj.SickLeaves= Convert.ToDecimal(model.LWP);
                obj.Lwp = 0;
                }

                if (model.IsApprove && model.SickLeaves != 0)
                {
                    obj.SickLeaves = model.SickLeaves;
                    obj.Lwp = model.LWP;
                    obj.Leaves = model.Leaves;
                    
                }
                else if(model.IsApprove && model.Leaves != 0)
                {
                    obj.Leaves = model.Leaves;
                    obj.Lwp = model.LWP;
                    obj.SickLeaves = 0;
                }
                else if(model.IsApprove && model.Leaves == 0)
                {
                    obj.Leaves = model.LWP;
                    obj.Lwp = 0;
                }   

                if (obj.Id != 0)
                {                  
                   isResult =await  leaveTransactionService.tblupdate(obj);
                }
                else
                {
                    isResult = await leaveTransactionService.tblinsert(obj);
                }
                //if(isResult)
                //{
                //    IEnumerable<TblLeaveMaster> lmlist = await leaveMasterService.GetLeaveForEmpandByYearEID(model.EmpId);
                //    List<TblLeaveMaster> asList = lmlist.ToList();
                //    TblLeaveMaster data = await leaveMasterService.Get(asList[0].EmpId);
                //    IEnumerable<GetLeaveTransactionList_Result> asTList = await leaveTransactionService.GetLeaveTransactionList(model.EmpId);
                //    var datas = asTList.ToList();                    
                //     var isavailable = datas.Where(x => System.DateTime.Now.Month == x.leave_date.Date.Month && System.DateTime.Now.Year == x.leave_date.Date.Year).FirstOrDefault();

                //    if (isavailable != null)
                //    {

                //        data.UsedLeaves = (data.UsedLeaves - model.PLeaves) + model.Leaves;
                //        data.BalanceLeaves = (data.BalanceLeaves + model.PLeaves) - model.Leaves;
                //    }
                //    else
                //    {
                //        data.Lwp = (data.Lwp - model.PLeaves) + model.Leaves;
                //    }
                //    isResult = await leaveMasterService.tblupdate(data);
                //}
                if (isResult)
                {
                    return Ok(new { Message = "Leave Transaction is saved successfully." });
                }
                else
                {
                    return BadRequest(new { Message = "Leave Transaction is Not saved successfully." });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Leave Transaction is Not saved successfully: Error - : {ex}");
            }
            return BadRequest();
        }

        [HttpDelete("DeleteLeaveTransaction/{id:int}")]
        public async Task<ActionResult> DeleteLeaveTransaction(int id)
        {
            try
            {
                var result = await leaveTransactionService.tbldelete(id);
                if (result)
                {
                    return Ok(new { Message = "Leave Transaction is Deleted successfully." });
                }
                else
                {
                    return BadRequest(new { Message = "Leave Transaction is Not Deleted." });
                }

            }
            catch (Exception ex)
            {
                Logger.LogError($"Leave Transaction is Not Deleted: Error : {ex}");
                return BadRequest();
            }
        }
    }
}
