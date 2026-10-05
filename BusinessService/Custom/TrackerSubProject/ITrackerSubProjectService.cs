using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.TrackerSubProject
{
    public interface ITrackerSubProjectService : IEntityService<TblTrackerSubProject>
    {
        Task<TblTrackerSubProject> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblTrackerSubProject tbl);
        Task<bool> tblupdate(TblTrackerSubProject tbl);
        Task<IEnumerable<TblTrackerSubProject>> GetTrackerSubProjectList(int projectid);
        Task<IEnumerable<GetTrackerSubProject_Result>> GetTrackerSubProject();
        Task<IEnumerable<GetProjectsList_Result>> GetProjectsList();
        Task<IEnumerable<GetCompanies_Result>> GetCompanies();
        Task<IEnumerable<TblProjectCategory>> GetProjectCategoryList();
    }
}
