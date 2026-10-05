using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.LeaveTransaction
{
    public interface ILeaveTransactionService : IEntityService<TblLeaveTransaction>
    {
        Task<TblLeaveTransaction> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblLeaveTransaction tbl);
        Task<bool> tblupdate(TblLeaveTransaction tbl);

        Task<IEnumerable<GetLeaveTransactionList_Result>> GetLeaveTransactionList(int EID, int FromDate, int ToDate,bool currentyear);
        Task<IEnumerable<GetLeaveTransactionList_Result>> GetLeaveEmployeeTransactionList();
        Task<IEnumerable<GetCurrentMonthAvailableLEave_Result>> GetCurrentMonthAvailableLeave(int eid);



    }
}
