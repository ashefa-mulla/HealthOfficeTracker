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

namespace BusinessService.Custom.VendorAccount
{
    public class VendorAccountService : EntityService<TblVandorAccount>, IVendorAccountService
    {
        readonly IGenericStoredProcedureRepository<TblVandorAccount> spRepository;
        readonly IGenericRepository<TblVandorAccount> repository;
        readonly IUnitOfWork unitOfWork;



        public VendorAccountService(IUnitOfWork _unitOfWork, IGenericRepository<TblVandorAccount> _repository, IGenericStoredProcedureRepository<TblVandorAccount> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblVandorAccount> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<int> tblinsert(TblVandorAccount tbl)
        {
            try
            {
                await Create(tbl);
                return tbl.Id;
            }
            catch (Exception)
            {
                return 0;
            }

        }

        public async Task<bool> tblupdate(TblVandorAccount tbl)
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
            catch (Exception ex)
            {
                return false;
            }

        }
        public async Task<bool> DeActivateVendorAccount(int id)
        {
            try
            {
                TblVandorAccount obj = await Get(id);
                obj.Active = false;
                await Update(obj);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        //to get profile detail

        public async Task<IEnumerable<GetAllVandorAccount_Result>> GetAllVendorAccount()
        {
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await spRepository.ExecWithStoreProcedureAsync<GetAllVandorAccount_Result>("exec GetAllVandorAccount");
        }
        public async Task<IEnumerable<GetAllVandorAccount_Result>> GetVendorAccountByCategoryID(int categoryid)
        {
            SqlParameter Id = new SqlParameter("@CategoryID", categoryid);
            return await spRepository.ExecWithStoreProcedureAsync<GetAllVandorAccount_Result>("exec GetAllVandorAccount @CategoryID", Id);
        }

    }
}
