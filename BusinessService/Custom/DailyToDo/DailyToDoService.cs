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

namespace BusinessService.Custom.DailyToDo
{
    public class DailyToDoService : EntityService<TblPunchDetailTodo>, IDailyToDoService
    {
        readonly IGenericStoredProcedureRepository<TblPunchDetailTodo> spRepository;
        readonly IGenericRepository<TblPunchDetailTodo> repository;
        readonly IUnitOfWork unitOfWork;



        public DailyToDoService(IUnitOfWork _unitOfWork, IGenericRepository<TblPunchDetailTodo> _repository, IGenericStoredProcedureRepository<TblPunchDetailTodo> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }
        public async Task<TblPunchDetailTodo> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblPunchDetailTodo tbl)
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

        public async Task<bool> tblupdate(TblPunchDetailTodo tbl)
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
        public async Task<IEnumerable<GetPunchDetailTodoByEmpID_Result>> GetPunchDetailTodoByEmpID(DateTime FromDate, DateTime ToDate, int EID)
        {
            if(EID == 0)
            return await spRepository.ExecWithStoreProcedureAsync<GetPunchDetailTodoByEmpID_Result>("exec GetPunchDetailTodoByEmpID @FromDate,@ToDate", new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate));
            else
                return await spRepository.ExecWithStoreProcedureAsync<GetPunchDetailTodoByEmpID_Result>("exec GetPunchDetailTodoByEmpID @FromDate,@ToDate,@EID", new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate), new SqlParameter("@EID", EID));
        }
        public async Task<IEnumerable<GetPuncDetailTodoIDForTodo_Result>> GetPuncDetailTodoIDForTodo(DateTime shift_dt, int EID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetPuncDetailTodoIDForTodo_Result>("exec GetPuncDetailTodoIDForTodo @shift_dt,@Employee_ID", new SqlParameter("@shift_dt", shift_dt), new SqlParameter("@Employee_ID", EID));
        }

        public async Task<IEnumerable<sp_gettodotasklist_Result>> GetTodotasklist(int Id)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_gettodotasklist_Result>("exec sp_gettodotasklist @Id", new SqlParameter("@Id", Id));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<IEnumerable<sp_gettasklistforall_Result>> Gettasklistforall()
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_gettasklistforall_Result>("exec sp_gettasklistforall");
        }
    }
}
