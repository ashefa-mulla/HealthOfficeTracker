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

namespace BusinessService.Custom.BankMaster
{
    public class BankMasterService : EntityService<TblBankMaster>, IBankMasterService
    {
        readonly IGenericStoredProcedureRepository<TblBankMaster> spRepository;
        readonly IGenericRepository<TblBankMaster> repository;
        readonly IUnitOfWork unitOfWork;



        public BankMasterService(IUnitOfWork _unitOfWork, IGenericRepository<TblBankMaster> _repository, IGenericStoredProcedureRepository<TblBankMaster> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblBankMaster> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblBankMaster tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> tblupdate(TblBankMaster tbl)
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


        //to get profile detail

        public async Task<IEnumerable<GetAllBankDetail_Result>> GetAllBankMaster()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetAllBankDetail_Result>("exec GetAllBankDetail");
        }
        public async Task<IEnumerable<GetAllBankList_Result>> GetAllBankList()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetAllBankList_Result>("exec GetAllBankList");
        }

        //public IEnumerable<GetPurchaseOrderReport_Result> GetPurchaseOrderReport(int PID)
        //{
        //    return _msPurchaseOrderRepository.ExecWithStoreProcedure<GetPurchaseOrderReport_Result>("GetPurchaseOrderReport @PID", new SqlParameter("@PID", PID));
        //}

        public async Task<bool> DeActivateBankMaster(int id)
        {
            try
            {
                TblBankMaster obj = await Get(id);
                obj.Active = false;
                await Update(obj);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
    }
}
