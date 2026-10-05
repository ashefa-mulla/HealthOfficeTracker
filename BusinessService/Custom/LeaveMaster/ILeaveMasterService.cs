using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.LeaveMaster
{
    public interface ILeaveMasterService : IEntityService<TblLeaveMaster>
    {
        Task<TblLeaveMaster> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblLeaveMaster tbl);
        Task<bool> tblupdate(TblLeaveMaster tbl);

        Task<IEnumerable<GetLeaveMasterList_Result>> GetLeaveMasterList();
        Task<IEnumerable<GetLeaveMasterList_Result>> GetLeaveMasterListbyEmpID(int eid);
        Task<IEnumerable<TblLeaveMaster>> GetLeaveForEmpandByYear();
        Task<IEnumerable<TblLeaveMaster>> GetLeaveForEmpandByYearEID(int eid);



    }
}
