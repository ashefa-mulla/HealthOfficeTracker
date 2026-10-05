using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.TaskActivity
{
    public interface ITaskActivityService : IEntityService<TblToptrackerTask>
    {
        Task<TblToptrackerTask> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblToptrackerTask tbl);
        Task<bool> tblupdate(TblToptrackerTask tbl);

        Task<IEnumerable<GetTaskActivity_Result>> GetAllTaskActivity();
        Task<IEnumerable<GetCompanies_Result>> GetCompanies();
        Task<IEnumerable<TblToptrackerTask>> GetTaskActivityList(int companyid, int branchid);

        Task<bool> DeActivateTaskActivity(int id);

    }
}
