using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.PunchDetail
{
    public interface IPunchDetailService : IEntityService<TblPunchDetail>
    {
        Task<TblPunchDetail> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblPunchDetail tbl);
        Task<bool> tblupdate(TblPunchDetail tbl);

        Task<IEnumerable<GetPunchDetailList_Result>> GetPunchDetailList(int EID);
        Task<IEnumerable<GetPunchIDForClockOut_Result>> GetPunchIDForClockOut(int EID);
        Task<IEnumerable<GetDateTimeForClockInOut_Result>> GetDateTimeForClockInOut();
        Task<IEnumerable<GetUserLogReport_Result>> GetUserLogReport(DateTime FromDate, DateTime ToDate);
        Task<IEnumerable<GetUserLogReportByEmpID_Result>> GetUserLogReportByEmpID(DateTime FromDate, DateTime ToDate, int EID);
        Task<IEnumerable<GetTimeLogByEmployeeID_Result>> GetTimeLogByEmployeeID(int EID, DateTime FromDate, DateTime ToDate);
        Task<IEnumerable<GetEventsList_Result>> GetEventsList();
        Task<IEnumerable<GetHrsBreaklyTimeLogByEmpID_Result>> GetHrsBreaklyTimeLogByEmpID(int EID, DateTime FromDate, DateTime ToDate);
        Task<IEnumerable<GetUserLogWithCaptureImg_Result>> GetUserLogWithCaptureImg();
        Task<IEnumerable<GetCompanyBranchListByCompanyID_Result>> GetCompanyBranchListByCompanyID(int cid);
    }
}
