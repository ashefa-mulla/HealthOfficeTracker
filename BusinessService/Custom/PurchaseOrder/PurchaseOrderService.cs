using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
//using AvailAnalytics.Service.Common;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
using BusinessService.Common;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.PurchaseOrder
{
    public class PurchaseOrderService : EntityService<TblPodetail>, IPurchaseOrderService
    {
        readonly IGenericStoredProcedureRepository<TblPodetail> spRepository;
        readonly IGenericRepository<TblPodetail> repository;
        readonly IUnitOfWork unitOfWork;



        public PurchaseOrderService(IUnitOfWork _unitOfWork, IGenericRepository<TblPodetail> _repository, IGenericStoredProcedureRepository<TblPodetail> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        //public async Task<TblPodetail> Get(int ID)
        //{

        //    return await repository.SelectById(ID);
        //}
        public async Task<TblPodetail?> Get(int ID)
{
    return await repository.SelectById(ID);
}

        public async Task<int> tblinsert(TblPodetail tbl)
        {
            try
            {
                await Create(tbl);
                return tbl.Id;
            }
            catch (Exception)
            {
                return tbl.Id;
            }

        }

        public async Task<bool> tblupdate(TblPodetail tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> tbldelete(int id)
        {
            try
            {
                await Delete(await Get(id));
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
        public async Task<IEnumerable<GetPurchaseOrderList_Result>> GetPurchaseOrderList(int compnayid)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetPurchaseOrderList_Result>("exec GetPurchaseOrderList @CID", new SqlParameter("@CID", compnayid));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<GetPurchaseOrderListbyFilter_Result>> GetPurchaseOrderListbyFilter(int Comp_ID, int active)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetPurchaseOrderListbyFilter_Result>("exec GetPurchaseOrderListbyFilter @CID,@active", new SqlParameter("@CID", Comp_ID), new SqlParameter("@active", active));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        
        public async Task<IEnumerable<GetPurchaseOrderReport_Result>> GetPurchaseOrderReport(int PID)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetPurchaseOrderReport_Result>("exec GetPurchaseOrderReport @PID", new SqlParameter("@PID", PID));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
               
        public async Task<IEnumerable<GetAllCostCentre_Result>> GetAllCostCentre()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetAllCostCentre_Result>("exec GetAllCostCentre");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<GetPOPaymentDueDate_Result>> GetPOPaymentDueDate(int year, int month)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetPOPaymentDueDate_Result>("exec GetPOPaymentDueDate @year,@month", new SqlParameter("@year", Convert.ToInt32(year)), new SqlParameter("@month", Convert.ToInt32(month)));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<POPaymentDueDateStmnt_Result>> POPaymentDueDateStmnt(int PID)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<POPaymentDueDateStmnt_Result>("exec POPaymentDueDateStmnt @ID", new SqlParameter("@ID", PID));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        
        public async Task<IEnumerable<GetPOPayBy_Result>> GetPOPayBy()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetPOPayBy_Result>("exec GetPOPayBy");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        
        public async Task<IEnumerable<GetSnailMail_Result>> GetSnailMail()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetSnailMail_Result>("exec GetSnailMail");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<sp_getpopaymentduedate>> GetPOPaymentDueDateCalender(int year, int month)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_getpopaymentduedate>("exec sp_getpopaymentduedate @year,@month", new SqlParameter("@year", Convert.ToInt32(year)), new SqlParameter("@month", Convert.ToInt32(month)));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<sp_getpopaymentduedatenotification>> GetPOPaymentDueDateNotification()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_getpopaymentduedatenotification>("exec sp_getpopaymentduedatenotification ");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
