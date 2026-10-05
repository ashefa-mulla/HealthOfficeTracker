using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
//using AvailAnalytics.Service.Common;
//using System.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Custom.TaskActivity
{
    public class TaskActivityService : EntityService<TblToptrackerTask>, ITaskActivityService
    {
        readonly IGenericStoredProcedureRepository<TblToptrackerTask> spRepository;
        readonly IGenericRepository<TblToptrackerTask> repository;
        readonly IUnitOfWork unitOfWork;



        public TaskActivityService(IUnitOfWork _unitOfWork, IGenericRepository<TblToptrackerTask> _repository, IGenericStoredProcedureRepository<TblToptrackerTask> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblToptrackerTask> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblToptrackerTask tbl)
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

        public async Task<bool> tblupdate(TblToptrackerTask tbl)
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

        public async Task<IEnumerable<GetTaskActivity_Result>> GetAllTaskActivity()
        {
            //return _msTaskActivityRepository.ExecWithStoreProcedure<GetAllTaskActivity_Result>("GetAllTaskActivity");
            return await spRepository.ExecWithStoreProcedureAsync<GetTaskActivity_Result>("exec GetTaskActivity");
        }

        public async Task<IEnumerable<GetCompanies_Result>> GetCompanies()
        {
            //return _msTaskActivityRepository.ExecWithStoreProcedure<GetAllTaskActivity_Result>("GetAllTaskActivity");
            return await spRepository.ExecWithStoreProcedureAsync<GetCompanies_Result>("exec GetCompanies");
        }
        public async Task<IEnumerable<TblToptrackerTask>> GetTaskActivityList(int companyid, int branchid)
        {
            return await unitOfWork.ctx.TblToptrackerTask.Where(m => m.Active == true).Where(m => m.CompanyId == companyid).Where(m => m.BranchId == branchid).OrderBy(m => m.Project).ToListAsync();
        }
        public async Task<bool> DeActivateTaskActivity(int id)
        {
            try
            {
                TblToptrackerTask obj = await Get(id);
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
