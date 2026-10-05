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

namespace BusinessService.Custom.TrackerSubProjectCategory
{
    public class TrackerSubProjectCategoryService : EntityService<TblTrackerSubProjectCategory>, ITrackerSubProjectCategoryService
    {
        readonly IGenericStoredProcedureRepository<TblTrackerSubProjectCategory> spRepository;
        readonly IGenericRepository<TblTrackerSubProjectCategory> repository;
        readonly IUnitOfWork unitOfWork;



        public TrackerSubProjectCategoryService(IUnitOfWork _unitOfWork, IGenericRepository<TblTrackerSubProjectCategory> _repository, IGenericStoredProcedureRepository<TblTrackerSubProjectCategory> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblTrackerSubProjectCategory> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblTrackerSubProjectCategory tbl)
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

        public async Task<bool> tblupdate(TblTrackerSubProjectCategory tbl)
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
        public async Task<IEnumerable<GetTrackerSubProjectcategory_Result>> GetTrackerSubProjectcategory()
        {            
            return await spRepository.ExecWithStoreProcedureAsync<GetTrackerSubProjectcategory_Result>("exec GetTrackerSubProjectcategory");
        }        
        public async Task<IEnumerable<GetTrackerSubProjectcategoryWithProject_Result>> GetTrackerSubProjectcategoryWithProject()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTrackerSubProjectcategoryWithProject_Result>("exec GetTrackerSubProjectcategoryWithProject");
        }
        
        public async Task<IEnumerable<GetCompanies_Result>> GetCompanies()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetCompanies_Result>("exec GetCompanies");
        }
        public async Task<IEnumerable<TblProjectCategory>> GetProjectCategoryList()
        {
            return await unitOfWork.ctx.TblProjectCategories.OrderBy(m => m.Category).ToListAsync();            
        }
        public async Task<IEnumerable<TblTrackerSubProjectCategory>> GetTrackerSubProjectCategoryList(int project_id, int subproject_id)
        {
            return await unitOfWork.ctx.TblTrackerSubProjectCategories.Where(m => m.ProjectId == project_id).Where(m => m.Active == true).Where(m => m.SubprojectId == subproject_id).OrderBy(m => m.Subcategory).ToListAsync();
        }
    }
}
