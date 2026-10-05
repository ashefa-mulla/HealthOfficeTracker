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

namespace BusinessService.Custom.AccountCategory
{
    public class AccountCategoryService : EntityService<TblAccountCategory>, IAccountCategoryService
    {
        readonly IGenericStoredProcedureRepository<TblAccountCategory> spRepository;
        readonly IGenericRepository<TblAccountCategory> repository;
        readonly IUnitOfWork unitOfWork;



        public AccountCategoryService(IUnitOfWork _unitOfWork, IGenericRepository<TblAccountCategory> _repository, IGenericStoredProcedureRepository<TblAccountCategory> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblAccountCategory> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblAccountCategory tbl)
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

        public async Task<bool> tblupdate(TblAccountCategory tbl)
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

        public async Task<IEnumerable<GetAllAccountCategory_Result>> GetAllAccountCategory()
        {
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await spRepository.ExecWithStoreProcedureAsync<GetAllAccountCategory_Result>("exec GetAllAccountCategory");
        }

        //public IEnumerable<GetOrderTypeList_Result> GetOrderTypeList(int CID)
        //{
        //    return _msPurchaseOrderRepository.ExecWithStoreProcedure<GetOrderTypeList_Result>("GetOrderTypeList @CID", new SqlParameter("@CID", CID));
        //}

        //public IEnumerable<GetPurchaseOrderReport_Result> GetPurchaseOrderReport(int PID)
        //{
        //    return _msPurchaseOrderRepository.ExecWithStoreProcedure<GetPurchaseOrderReport_Result>("GetPurchaseOrderReport @PID", new SqlParameter("@PID", PID));
        //}

        public async Task<bool> DeActivateAccountCategory(int id)
        {
            try
            {
                TblAccountCategory obj = await Get(id);
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
