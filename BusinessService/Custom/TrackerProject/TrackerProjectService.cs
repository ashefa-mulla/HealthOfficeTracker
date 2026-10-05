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
using System.Collections;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.TrackerProject
{
    public class TrackerProjectService : EntityService<TblTrackerProject>, ITrackerProjectService
    {
        readonly IGenericStoredProcedureRepository<TblTrackerProject> spRepository;
        readonly IGenericRepository<TblTrackerProject> repository;
        readonly IUnitOfWork unitOfWork;



        public TrackerProjectService(IUnitOfWork _unitOfWork, IGenericRepository<TblTrackerProject> _repository, IGenericStoredProcedureRepository<TblTrackerProject> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblTrackerProject> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblTrackerProject tbl)
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

        public async Task<bool> tblupdate(TblTrackerProject tbl)
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

        public async Task<IEnumerable<GetTrackerProject_Result>> GetAllTrackerProject()
        {
            //return _msTrackerProjectRepository.ExecWithStoreProcedure<GetAllTrackerProject_Result>("GetAllTrackerProject");
            return await spRepository.ExecWithStoreProcedureAsync<GetTrackerProject_Result>("exec GetTrackerProject");
        }

        public async Task<IEnumerable<GetCompanies_Result>> GetCompanies()
        {
            //return _msTrackerProjectRepository.ExecWithStoreProcedure<GetAllTrackerProject_Result>("GetAllTrackerProject");
            return await spRepository.ExecWithStoreProcedureAsync<GetCompanies_Result>("exec GetCompanies");
        }
        //public async Task<IEnumerable<TblTrackerProject>> GetTrackerProjectList(int companyid, int branchid)
        //{
        //    return await unitOfWork.ctx.TblTrackerProject.Where(m => m.Active == true).Where(m => m.CompanyId == companyid).Where(m => m.BranchId == branchid).OrderBy(m => m.Project).ToListAsync();
        //}        

        public async Task<IEnumerable<TblTrackerProject>> GetTrackerProjectList(int companyid, int branchid, int adminId)
        {
            if (adminId == 0)
            {

                return await unitOfWork.ctx.TblTrackerProjects.Where(m => m.Active == true).Where(m => m.CompanyId == companyid).Where(m => m.BranchId == branchid).OrderBy(m => m.Project).ToListAsync();
            }
            else
            {       
             // 1. Get allowed project IDs for this admin from Tbl_ClientProjectAccess
            var allowedProjectIds = await unitOfWork.ctx.TblClientProjectAccesses
                    .Where(a => a.AdminId == adminId)
                    .Select(a => a.ProjectId)
                    .ToListAsync();

            // 2. Get projects filtered by company, branch, active status AND allowed project IDs
            var projects = await unitOfWork.ctx.TblTrackerProjects
                .Where(p => p.Active == true)
                .Where(p => p.CompanyId == companyid)
                .Where(p => p.BranchId == branchid)
                .Where(p => allowedProjectIds.Contains(p.Id))
                .OrderBy(p => p.Project)
                .ToListAsync();

            return projects;
        }
    }

        public async Task<IEnumerable<get_trackerprojectfor_vc_Result>> GetTrackerProjectListclient(int companyid, int branchid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<get_trackerprojectfor_vc_Result>("exec get_trackerprojectfor_vc @CompanyID, @BranchID", new SqlParameter("@CompanyID", companyid), new SqlParameter("@BranchID", branchid));
        }
        public async Task<bool> DeActivateTrackerProject(int id)
        {
            try
            {
                TblTrackerProject obj = await Get(id);
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
