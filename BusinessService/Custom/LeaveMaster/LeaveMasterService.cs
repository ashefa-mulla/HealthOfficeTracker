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
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.LeaveMaster
{
    public class LeaveMasterService : EntityService<TblLeaveMaster>, ILeaveMasterService
    {
        readonly IGenericStoredProcedureRepository<TblLeaveMaster> spRepository;
        readonly IGenericRepository<TblLeaveMaster> repository;
        readonly IUnitOfWork unitOfWork;



        public LeaveMasterService(IUnitOfWork _unitOfWork, IGenericRepository<TblLeaveMaster> _repository, IGenericStoredProcedureRepository<TblLeaveMaster> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblLeaveMaster> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblLeaveMaster tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> tblupdate(TblLeaveMaster tbl)
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

        public async Task<IEnumerable<GetLeaveMasterList_Result>> GetLeaveMasterListbyEmpID(int eid)
        {
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await spRepository.ExecWithStoreProcedureAsync<GetLeaveMasterList_Result>("exec GetLeaveMasterList @empID", new SqlParameter("@empID", eid));
        }
        public async Task<IEnumerable<GetLeaveMasterList_Result>> GetLeaveMasterList()
        {
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await spRepository.ExecWithStoreProcedureAsync<GetLeaveMasterList_Result>("exec GetLeaveMasterList");
        }
        public async Task<IEnumerable<TblLeaveMaster>> GetLeaveForEmpandByYear()
        {
            int currentyear = DateTime.Now.Year;
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await unitOfWork.ctx.TblLeaveMasters.Where(m => m.AcYear == currentyear).OrderBy(m => m.Id).ToListAsync();
        }

        public async Task<IEnumerable<TblLeaveMaster>> GetLeaveForEmpandByYearEID(int EID)
        {
            int currentyear = DateTime.Now.Year;
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await unitOfWork.ctx.TblLeaveMasters.Where(m => m.AcYear == currentyear).OrderBy(m => m.EmpId == EID).ToListAsync();
        }

    }
}
