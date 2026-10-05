using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.TrackerProject
{
    public interface ITrackerProjectService : IEntityService<TblTrackerProject>
    {
        Task<TblTrackerProject> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblTrackerProject tbl);
        Task<bool> tblupdate(TblTrackerProject tbl);

        Task<IEnumerable<GetTrackerProject_Result>> GetAllTrackerProject();
        Task<IEnumerable<GetCompanies_Result>> GetCompanies();
        //Task<IEnumerable<TblTrackerProject>> GetTrackerProjectList(int companyid, int branchid);
        Task<IEnumerable<TblTrackerProject>> GetTrackerProjectList(int companyid, int branchid, int adminId);
        Task<IEnumerable<get_trackerprojectfor_vc_Result>> GetTrackerProjectListclient(int companyid, int branchid);

        Task<bool> DeActivateTrackerProject(int id);

    }
}
