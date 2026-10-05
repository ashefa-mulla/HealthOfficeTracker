using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.TrackerSubProjectCategory
{
    public interface ITrackerSubProjectCategoryService : IEntityService<TblTrackerSubProjectCategory>
    {
        Task<TblTrackerSubProjectCategory> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblTrackerSubProjectCategory tbl);
        Task<bool> tblupdate(TblTrackerSubProjectCategory tbl);
        Task<IEnumerable<GetTrackerSubProjectcategory_Result>> GetTrackerSubProjectcategory();
        Task<IEnumerable<GetTrackerSubProjectcategoryWithProject_Result>> GetTrackerSubProjectcategoryWithProject();
        Task<IEnumerable<TblTrackerSubProjectCategory>> GetTrackerSubProjectCategoryList(int project_id, int subproject_id);

    }
}
