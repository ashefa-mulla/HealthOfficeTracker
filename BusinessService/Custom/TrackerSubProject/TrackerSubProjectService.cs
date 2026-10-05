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

namespace BusinessService.Custom.TrackerSubProject
{
    public class TrackerSubProjectService : EntityService<TblTrackerSubProject>, ITrackerSubProjectService
    {
        readonly IGenericStoredProcedureRepository<TblTrackerSubProject> spRepository;
        readonly IGenericRepository<TblTrackerSubProject> repository;
        readonly IUnitOfWork unitOfWork;



        public TrackerSubProjectService(IUnitOfWork _unitOfWork, IGenericRepository<TblTrackerSubProject> _repository, IGenericStoredProcedureRepository<TblTrackerSubProject> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblTrackerSubProject> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblTrackerSubProject tbl)
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

        public async Task<bool> tblupdate(TblTrackerSubProject tbl)
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
    
        public async Task<IEnumerable<TblTrackerSubProject>> GetTrackerSubProjectList(int projectid)
        {
            return await unitOfWork.ctx.TblTrackerSubProjects.Where(m => m.ProjectId == projectid && m.Active == true).OrderBy(m => m.ProjectId).ToListAsync();
        }
        public async Task<IEnumerable<GetTrackerSubProject_Result>> GetTrackerSubProject()
        {
            //return await spRepository.ExecWithStoreProcedureAsync<GetTrackerSubProject_Result>("exec GetTrackerSubProject");
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetTrackerSubProject_Result>("exec GetTrackerSubProject");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }        
        public async Task<IEnumerable<GetProjectsList_Result>> GetProjectsList()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetProjectsList_Result>("exec GetProjectsList");
        }
        
        public async Task<IEnumerable<GetCompanies_Result>> GetCompanies()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetCompanies_Result>("exec GetCompanies");
        }
        public async Task<IEnumerable<TblProjectCategory>> GetProjectCategoryList()
        {
            return await unitOfWork.ctx.TblProjectCategories.OrderBy(m => m.Category).ToListAsync();            
        }       
    }
}
