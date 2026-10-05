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
using BusinessService.Custom.PurchaseOrder;
using BusinessService.Custom.PurchaseOrderReferenceDocument;
using AutoMapper;
using System.IO;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
     public class PurchaseOrderController : ControllerBase
     {
        private readonly IMapper Mapper;
        private readonly IUserService userServices;
        private readonly ILogger<PurchaseOrderController> Logger;
        private readonly IPurchaseOrderService _purchaseorderService;
        private readonly IPurchaseOrderReferenceDocumentService _purchaseorderreferenceDocumentService;

        //public PurchaseOrderController(UserManager<ApplicationUser> ILogger<PurchaseOrderController> logger, IOptions<ApplicationSettings> appSettings, IUserService purchaseorderService)
        public PurchaseOrderController(IMapper _mapper, ILogger<PurchaseOrderController> _logger, IUserService _userServices, IPurchaseOrderService purchaseorderService, IPurchaseOrderReferenceDocumentService purchaseOrderReferenceDocumentService)
        {
            Mapper = _mapper;
            Logger = _logger;
            userServices = _userServices;
            _purchaseorderService = purchaseorderService;
            _purchaseorderreferenceDocumentService = purchaseOrderReferenceDocumentService;

        }
        [HttpGet("GetPurchaseOrderList/{compnayid}")]
        public async Task<ActionResult<GetPurchaseOrderList_Result>> GetPurchaseOrderList(int compnayid)
        {
            try
            {
                var result = await _purchaseorderService.GetPurchaseOrderList(compnayid);

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
        [HttpGet("GetPurchaseorder/{id}")]
        public async Task<ActionResult<PurchaseOrderModel>> Get(int id)
        {
            try
            {
                var result = await _purchaseorderService.Get(id);

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
        [HttpGet("GetPurchaseOrderRefDocList/{PID}")]
        public async Task<ActionResult<GetPurchaseOrderRefDocList_Result>> GetPurchaseOrderRefDocList(int PID)
        {
            try
            {
                var result = await _purchaseorderreferenceDocumentService.GetPurchaseOrderRefDocList(PID);

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
        [HttpGet("GetPurchaseOrderReport/{PID}")]
        public async Task<ActionResult<GetPurchaseOrderReport_Result>> GetPurchaseOrderReport(int PID)
        {
            try
            {
                var result = await _purchaseorderService.GetPurchaseOrderReport(PID);

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
        [HttpPost("addeditPurchasehorder")]
        public async Task<ActionResult<PurchaseOrderModel>> addeditPurchasehorder(PurchaseOrderModel model)
        {
            try
            {
                bool isResult = false;
                if(model.PoType == "--Select--")
                {
                    model.PoType = null;
                }
                TblPodetail obj = Mapper.Map<PurchaseOrderModel, TblPodetail>(model);
                int POID = 0;
                if (obj.Id != 0)
                {
                    isResult = await _purchaseorderService.tblupdate(obj);
                    POID = model.Id;
                }
                else
                {
                    obj.CompanyId = 1;
                    POID = await _purchaseorderService.tblinsert(obj);
                    isResult = true;
                }

                if (isResult && model.filesdoc != null && model.filesdoc != "NoFile" && POID>0)
                {
                    POReferanceDocument pomodel = new POReferanceDocument();
                    pomodel.POID = model.Id;
                    pomodel.ReferanceDocument = model.filesdoc;
                    TblPoReferanceDocument objs = Mapper.Map<POReferanceDocument, TblPoReferanceDocument>(pomodel);
                    isResult = await _purchaseorderreferenceDocumentService.tblinsert(objs);
                    if (!isResult)
                    {
                        return NotFound(new { message = "Error in Reference Document" });
                    }

                }

                if (isResult)
                {
                    return Ok(new { message = "Success!!" });
                }
                else
                {
                    return BadRequest(new { message = "incorrect!!" });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error - : {ex}");
            }
            return BadRequest();
        }
        [HttpDelete("deletePurchasehorder/{id:int}")]
        public async Task<ActionResult> DeletePurchasehorder(int id)
        {
            try
            {
                var result = await _purchaseorderService.tbldelete(id);
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

        [HttpGet("GetAllCostCentre")]
        public async Task<ActionResult<GetAllCostCentre_Result>> GetAllCostCentre()
        {
            try
            {
                var result = await _purchaseorderService.GetAllCostCentre();

                if (result != null)
                {
                    List<GetAllCostCentre_Result> results = new List<GetAllCostCentre_Result>();
                    results.Add(new GetAllCostCentre_Result { ID = 0, CostCentreName = "--Select--" });
                    results.AddRange(result.Select(d => new GetAllCostCentre_Result { CostCentreName = d.CostCentreName, ID = d.ID }).ToList());
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

        [HttpGet("GetPopayby")]
        public async Task<ActionResult<GetPOPayBy_Result>> GetPopayby()
        {
            try
            {
                var result = await _purchaseorderService.GetPOPayBy();

                if (result != null)
                {
                    List<GetPOPayBy_Result> results = new List<GetPOPayBy_Result>();
                    results.Add(new GetPOPayBy_Result { ID = 0, PayBy = "--Select--" });
                    results.AddRange(result.Select(d => new GetPOPayBy_Result { PayBy = d.PayBy, ID = d.ID }).ToList());
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

        [HttpGet("GetSnailMail")]
        public async Task<ActionResult<GetSnailMail_Result>> GetSnailMail()
        {
            try
            {
                var result = await _purchaseorderService.GetSnailMail();

                if (result != null)
                {
                    List<GetSnailMail_Result> results = new List<GetSnailMail_Result>();
                    results.Add(new GetSnailMail_Result { ID = 0, Desc = "--Select--" });
                    results.AddRange(result.Select(d => new GetSnailMail_Result { Desc = d.Desc, ID = d.ID }).ToList());
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

        [HttpGet("deleteFile/{id}")]
        public async Task<ActionResult> deleteFile(int id)
        {
            try
            {
                bool Result = false;
                TblPoReferanceDocument model = await _purchaseorderreferenceDocumentService.Get(id);
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), model.ReferanceDocument);
                if (System.IO.File.Exists(pathToSave))
                {
                    System.IO.File.Delete(pathToSave);

                }
                Result = await _purchaseorderreferenceDocumentService.tbldelete(model.Id);
                if (Result)
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

        [HttpGet("GetPurchaseOrderParaList/{compnayid}")]
        public async Task<ActionResult<GetPurchaseOrderList_Result>> GetPurchaseOrderParaList(int compnayid)
        {
            try
            {
                var result = await _purchaseorderService.GetPurchaseOrderList(compnayid);

                if (result != null)
                {
                    List<GetPurchaseOrderList_Result> results = new List<GetPurchaseOrderList_Result>();
                    results.Add(new GetPurchaseOrderList_Result { ID = 0, Name = "--Select--" });
                    results.AddRange(result.Select(d => new GetPurchaseOrderList_Result { Name = d.Name, ID = d.ID }).ToList());
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

        [HttpGet("GetPurchaseOrderDueDateList")]
        public async Task<ActionResult<GetPOPaymentDueDate_Result>> GetPurchaseOrderDueDateList(int mon, int year)
        {
            try
            {
                var result = await _purchaseorderService.GetPOPaymentDueDate(year,mon);

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
        [HttpGet("GetPurchaseOrderListbyFilter")]
        public async Task<ActionResult<GetPurchaseOrderListbyFilter_Result>> GetPurchaseOrderListbyFilter(int compnayid, int active)
        {
            try
            {
                var result = await _purchaseorderService.GetPurchaseOrderListbyFilter(compnayid, active);

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
        [HttpGet("GetPurchaseOrderDueDateEvents")]
        public async Task<ActionResult<GetPOPaymentDueDate_Result>> GetDailyEvents(int mon, int year)
        {
            try
            {


                var result = await _purchaseorderService.GetPOPaymentDueDateCalender(year, mon);
                var eventList = from e in result
                                select new
                                {
                                    id = e.ID,
                                    title = "Code : " + e.Code + " || Vendor Name: " + e.VendorName + " || Category Name: " + e.CategoryName + " || Amount($): " + e.PO_Amount,
                                    title2 = e.VendorName,
                                    start = e.NextPaymentDueDate.ToString(),
                                    end = e.NextPaymentDueDate.ToString(),
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
        [HttpGet("GetPurchaseOrderDueDateNotification")]
        public async Task<ActionResult<sp_getpopaymentduedatenotification>> GetPurchaseOrderDueDateNotification()
        {
            try
            {
                var result = await _purchaseorderService.GetPOPaymentDueDateNotification();

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
