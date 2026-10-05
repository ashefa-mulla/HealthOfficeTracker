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

namespace BusinessService.Custom.TaskActivity
{
    public class TaskListService : EntityService<TblTaskList>, ITaskListService
    {
        readonly IGenericStoredProcedureRepository<TblTaskList> spRepository;
        readonly IGenericRepository<TblTaskList> repository;
        readonly IUnitOfWork unitOfWork;



        public TaskListService(IUnitOfWork _unitOfWork, IGenericRepository<TblTaskList> _repository, IGenericStoredProcedureRepository<TblTaskList> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblTaskList> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblTaskList tbl)
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

        public async Task<bool> tblupdate(TblTaskList tbl)
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

        public async Task<IEnumerable<GetTaskListDetail_Result>> GetTaskListDetail()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetTaskListDetail_Result>("exec GetTaskListDetail");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }

        public async Task<IEnumerable<GetEmployerName_Result>> GetEmployerName()
        {
            //return _msTaskActivityRepository.ExecWithStoreProcedure<GetAllTaskActivity_Result>("GetAllTaskActivity");
            return await spRepository.ExecWithStoreProcedureAsync<GetEmployerName_Result>("exec GetEmployerName");
        }
        public async Task<IEnumerable<GetTaskListForUser_Result>> GetTaskListForUser(int Eid, string status = "P")
        {
            //return _msTaskActivityRepository.ExecWithStoreProcedure<GetAllTaskActivity_Result>("GetAllTaskActivity");
            return await spRepository.ExecWithStoreProcedureAsync<GetTaskListForUser_Result>("exec GetTaskListForUser @Eid, @status", new SqlParameter("@Eid", Eid), new SqlParameter("@status", status));
        }

        public async Task<IEnumerable<GetTaskListForUserPendingList_Result>> GetTaskListForUserPendingList(int Eid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTaskListForUserPendingList_Result>("exec GetTaskListForUserPendingList @Eid", new SqlParameter("@Eid", Eid));
        }
        //new added for pegination
        public async Task<IEnumerable<GetTaskListForUserwithPegination_Results>> GetTaskListForUserPegination(int Eid, string status = "P", int pageNumber = 1, int pageSize = 10)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTaskListForUserwithPegination_Results>("exec GetTaskListForUserwithPegination @Eid, @status, @PageNumber, @PageSize",
                new SqlParameter("@Eid", Eid),
                new SqlParameter("@status", status),
                new SqlParameter("@PageNumber", pageNumber),
                new SqlParameter("@PageSize", pageSize)
            );
        }

        public async Task<IEnumerable<GetTaskCountListForUserwithPegination_Results>> GetTaskCountListForUserPegination(int empId, string status)
        {
            SqlParameter EmpID = new SqlParameter("@Eid", empId);
            SqlParameter Status = new SqlParameter("@status", status);

            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetTaskCountListForUserwithPegination_Results>("exec GetTaskCountListForUserwithPegination @Eid, @status", EmpID, Status);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }
}
