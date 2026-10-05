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
using Microsoft.Data.SqlClient;
using System.Data;

namespace BusinessService.Custom.Notification
{
    public class NotificationService : EntityService<TblNotification>, INotificationService
    {
        readonly IGenericStoredProcedureRepository<TblNotification> spRepository;
        readonly IGenericRepository<TblNotification> repository;
        readonly IUnitOfWork unitOfWork;



        public NotificationService(IUnitOfWork _unitOfWork, IGenericRepository<TblNotification> _repository, IGenericStoredProcedureRepository<TblNotification> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblNotification> Get(int ID)
        {

            return await repository.SelectById(ID);
        }
        public async Task<bool> tblinsert(TblNotification tbl)
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

        public async Task<bool> tblupdate(TblNotification tbl)
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

        public async Task<IEnumerable<GetUserLogNotification_Result>> GetTodayNotification()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUserLogNotification_Result>("GetUserLogNotification");
        }
        public async Task<IEnumerable<GetUserLogNotification_Result>> GetUserLogNotification()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUserLogNotification_Result>("exec GetUserLogNotification");
        }
        public async Task<IEnumerable<GetCurrentMonthBirthDay_Result>> GetCurrentMonthBirthDay()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetCurrentMonthBirthDay_Result>("exec GetCurrentMonthBirthDay");
        }
        public async Task<IEnumerable<GetVOEventsNotification_Result>> GetVOEventsNotification()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetVOEventsNotification_Result>("exec GetVOEventsNotification");
        }

        public async Task<IEnumerable<GetEmpLeaveBalance_Result>> GetEmpLeaveBalance(int EID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetEmpLeaveBalance_Result>("GetEmpLeaveBalance @eid", new SqlParameter("@eid", EID));
        }

        public async Task<IEnumerable<GetTodayLeaveList_Result>> GetTodayLeaveList()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTodayLeaveList_Result>("GetTodayLeaveList");
        }
        public async Task<IEnumerable<GetNotificationDetailByUserID_Result>> GetNotificationDetailByUserID(int UID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetNotificationDetailByUserID_Result>("GetNotificationDetailByUserID @UID", new SqlParameter("@UID", UID));
        }
        public async Task<IEnumerable<getclientgraphreport_Result>> GetGraphReport(DateTime FromDate, DateTime ToDate)
        {
            return await spRepository.ExecWithStoreProcedureAsync<getclientgraphreport_Result>("exec getclientgraphreport @startdt,@enddt", new SqlParameter("@startdt", FromDate), new SqlParameter("@enddt", ToDate));
        }
        public async Task<IEnumerable<GeTeamList_Results>> GetTeamMambers()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GeTeamList_Results>("GeTeamList");
        }
        public async Task<IEnumerable<sp_GetEmployeeTaskSummary_Yesterday_Results>> GetEmployeeTaskSummaryForYesterday()
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_GetEmployeeTaskSummary_Yesterday_Results>("sp_GetEmployeeTaskSummary_Yesterday");
        }
        //
        public async Task<sp_getcurrentmonthOutstandingByAdmin_Results> GetCurrentMonthOutstanding(int adminId)
        {
            try
            {
                // Create SqlParameter explicitly instead of anonymous object
                var adminIdParam = new SqlParameter("@AdminId", SqlDbType.Int) { Value = adminId };

                // Call stored procedure passing SqlParameter array
                var result = await spRepository.ExecWithStoreProcedureAsync<sp_getcurrentmonthOutstandingByAdmin_Results>(
                    "sp_getcurrentmonthOutstandingByAdmin @AdminId",
                    adminIdParam  // <-- Pass SqlParameter instead of anonymous type
                );

                return result.FirstOrDefault(); // Expecting one row only
            }
            catch (Exception ex)
            {
                // Log the error (replace Console.WriteLine with your logger)
                Console.WriteLine($"Error in GetCurrentMonthOutstanding: {ex.Message}");
                throw; // rethrow to be caught by controller
            }
        }

        public async Task<IEnumerable<sp_getadminprojectsummaryfordashboard_Results>> GetAdminProjectReportByAdminAsync(int adminId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var parameters = new[]
                {
            new SqlParameter("@AdminID", SqlDbType.Int) { Value = adminId },
            new SqlParameter("@start", SqlDbType.Date) { Value = startDate },
            new SqlParameter("@end", SqlDbType.Date) { Value = endDate }
        };

                return await spRepository.ExecWithStoreProcedureAsync<sp_getadminprojectsummaryfordashboard_Results>(
                    "sp_getadminprojectsummaryfordashboard @AdminID, @start, @end", parameters);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAdminProjectReportByAdminAsync: {ex}");
                throw;
            }
        }


        public async Task<IEnumerable<getfeedbackformmentionpointssummary>> GetMentionPointsSummaryAsync(DateTime startDate, DateTime endDate)
        {
            var startParam = new SqlParameter("@StartDate", startDate);
            var endParam = new SqlParameter("@EndDate", endDate);

            return await spRepository.ExecWithStoreProcedureAsync<getfeedbackformmentionpointssummary>(
                "exec usp_GetMentionPointsSummary @StartDate, @EndDate",
                startParam,
                endParam
            );
        }

        public async Task<IEnumerable<sp_getbelow3hremployeedailyduration_Results>> GetBelow3HrEmployeeDailyDurationAsync(DateTime startDate, DateTime endDate)
        {
            var startParam = new SqlParameter("@StartDate", startDate);
            var endParam = new SqlParameter("@EndDate", endDate);

            return await spRepository.ExecWithStoreProcedureAsync<sp_getbelow3hremployeedailyduration_Results>(
                "exec sp_getbelow3hremployeedailyduration @StartDate, @EndDate",
                startParam,
                endParam
            );
        }

        public async Task<IEnumerable<sp_getemployeesnottrackedyesterday_results>> GetEmployeesNotTrackedYesterdayAsync()
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_getemployeesnottrackedyesterday_results>("sp_getemployeesnottrackedyesterday");
        }

        public async Task<IEnumerable<sp_getonlineemployeedashboardsummary_Result>>
        GetOnlineEmployeeDashboardSummary(string userIds)
        {
            var userParam = new SqlParameter("@UserIds", userIds);

            return await spRepository.ExecWithStoreProcedureAsync
                <sp_getonlineemployeedashboardsummary_Result>(
                "exec sp_getonlineemployeedashboardsummary @UserIds",
                userParam
            );
        }


    }
}
