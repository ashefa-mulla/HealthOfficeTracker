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
    public interface ITaskListService : IEntityService<TblTaskList>
    {
        Task<TblTaskList> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblTaskList tbl);
        Task<bool> tblupdate(TblTaskList tbl);
        Task<IEnumerable<GetTaskListDetail_Result>> GetTaskListDetail();
        Task<IEnumerable<GetEmployerName_Result>> GetEmployerName();
        Task<IEnumerable<GetTaskListForUser_Result>> GetTaskListForUser(int Eid, string status="P");
        Task<IEnumerable<GetTaskListForUserPendingList_Result>> GetTaskListForUserPendingList(int Eid);
        //new with pegination
        Task<IEnumerable<GetTaskListForUserwithPegination_Results>> GetTaskListForUserPegination(int Eid, string status = "P", int pageNumber = 1, int pageSize = 10);
        Task<IEnumerable<GetTaskCountListForUserwithPegination_Results>> GetTaskCountListForUserPegination(int empId, string status);



    }
}
