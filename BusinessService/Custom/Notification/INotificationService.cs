using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.Notification
{
    public interface INotificationService : IEntityService<TblNotification>
    {
        Task<TblNotification> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblNotification tbl);
        Task<bool> tblupdate(TblNotification tbl);
        Task<IEnumerable<GetUserLogNotification_Result>> GetTodayNotification();
        Task<IEnumerable<GetNotificationDetailByUserID_Result>> GetNotificationDetailByUserID(int UID);
        Task<IEnumerable<GetCurrentMonthBirthDay_Result>> GetCurrentMonthBirthDay();
        Task<IEnumerable<GetVOEventsNotification_Result>> GetVOEventsNotification();
        Task<IEnumerable<GetEmpLeaveBalance_Result>> GetEmpLeaveBalance(int EID);
        Task<IEnumerable<GetTodayLeaveList_Result>> GetTodayLeaveList();
        Task<IEnumerable<getclientgraphreport_Result>> GetGraphReport(DateTime FromDate, DateTime ToDate);
        Task<IEnumerable<GeTeamList_Results>> GetTeamMambers();
        Task<IEnumerable<sp_GetEmployeeTaskSummary_Yesterday_Results>> GetEmployeeTaskSummaryForYesterday();
        Task<sp_getcurrentmonthOutstandingByAdmin_Results> GetCurrentMonthOutstanding(int adminId);
        Task<IEnumerable<sp_getadminprojectsummaryfordashboard_Results>> GetAdminProjectReportByAdminAsync(int adminId, DateTime startDate, DateTime endDate);

        Task<IEnumerable<getfeedbackformmentionpointssummary>> GetMentionPointsSummaryAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<sp_getbelow3hremployeedailyduration_Results>> GetBelow3HrEmployeeDailyDurationAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<sp_getemployeesnottrackedyesterday_results>> GetEmployeesNotTrackedYesterdayAsync();
        Task<IEnumerable<sp_getonlineemployeedashboardsummary_Result>>GetOnlineEmployeeDashboardSummary(string userIds);

    }
}
