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
using System.Data.SqlTypes;

namespace BusinessService.Custom.LeaveTransaction
{
    public class LeaveTransactionService : EntityService<TblLeaveTransaction>, ILeaveTransactionService
    {
        readonly IGenericStoredProcedureRepository<TblLeaveTransaction> spRepository;
        readonly IGenericRepository<TblLeaveTransaction> repository;
        readonly IUnitOfWork unitOfWork;



        public LeaveTransactionService(IUnitOfWork _unitOfWork, IGenericRepository<TblLeaveTransaction> _repository, IGenericStoredProcedureRepository<TblLeaveTransaction> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblLeaveTransaction> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblLeaveTransaction tbl)
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

        public async Task<bool> tblupdate(TblLeaveTransaction tbl)
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

        public async Task<IEnumerable<GetLeaveTransactionList_Result>> GetLeaveTransactionList(int eid, int month, int year, bool currentyear)
        {
            if(eid != 0)
            return await spRepository.ExecWithStoreProcedureAsync<GetLeaveTransactionList_Result>("exec GetLeaveTransactionList @EID", new SqlParameter("@EID", eid));
            else if(currentyear)
                return await spRepository.ExecWithStoreProcedureAsync<GetLeaveTransactionList_Result>("exec GetLeaveTransactionList @EID, @month,@year", new SqlParameter("@EID", eid), new SqlParameter("@month", SqlInt32.Null), new SqlParameter("@year", year));
            else
             return await spRepository.ExecWithStoreProcedureAsync<GetLeaveTransactionList_Result>("exec GetLeaveTransactionList @EID, @month,@year", new SqlParameter("@EID", eid), new SqlParameter("@month", month), new SqlParameter("@year", year));

        }
        public async Task<IEnumerable<GetLeaveTransactionList_Result>> GetLeaveEmployeeTransactionList()
        {
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await spRepository.ExecWithStoreProcedureAsync<GetLeaveTransactionList_Result>("exec GetLeaveTransactionList");
        }
        public async Task<IEnumerable<GetCurrentMonthAvailableLEave_Result>> GetCurrentMonthAvailableLeave(int eid)
        {
            //return _msAccountCategoryRepository.ExecWithStoreProcedure<GetAllAccountCategory_Result>("GetAllAccountCategory");
            return await spRepository.ExecWithStoreProcedureAsync<GetCurrentMonthAvailableLEave_Result>("exec GetCurrentMonthAvailableLEave @EID", new SqlParameter("@EID", eid));
        }
    }
}
