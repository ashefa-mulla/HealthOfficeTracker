using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.UtilizationTracker
{
    public interface IUtilizationTrackerService : IEntityService<TblToptrackerTask>
    {
        Task<TblToptrackerTask> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<int> tblinsert4watcher(TblToptrackerTask tbl);
        Task<bool> tblinsert(TblToptrackerTask tbl);
        Task<bool> tblupdate(TblToptrackerTask tbl);
        Task<IEnumerable<GetTopTrackerTaskEntry_Result>> GetTopTrackerTaskEntrylist(int EID);
        Task<IEnumerable<GetProjectTaskWithDuration_Result>> GetProjectTaskWithDuration(int EID);
        Task<IEnumerable<GetTrackerSummarybyMonth_Result>> GetTrackerSummarybyMonth(DateTime FromDate, DateTime ToDate, int PID, int active);
        Task<IEnumerable<GetTrackerTaskbyMonth_Result>> GetTrackerTaskbyMonth(DateTime FromDate, DateTime ToDate, int PID, int active);
        Task<IEnumerable<GetAttendanceReport_Result>> GetAttendanceReport(int month, int year);
        Task<IEnumerable<GetSummaryOfEmployeeTask_Result>> GetSummaryOfEmployeeTask(DateTime FromDate, DateTime ToDate, int EID);
        Task<IEnumerable<GetActiveLogOfEmployee_Result>> GetActiveLogOfEmployee(DateTime FromDate, DateTime ToDate, int EID, int UID);
        Task<IEnumerable<GetActiveLogOfEmployee_VC_Result>> GetActiveLogOfEmployeeclient(DateTime FromDate, DateTime ToDate, int EID, int UID);
        Task<IEnumerable<GetUtilizationReportwithProject_Result>> GetUtilizationReportSummarywithProject(DateTime FromDate, DateTime ToDate, int EID, int Projrctid, int Subprojectid);
        Task<IEnumerable<GetUtilizationReportDetailwithProject_Result>> GetUtilizationReportwithDetailProject(DateTime FromDate, DateTime ToDate, int EID, int UID, int Projrctid, int Subprojectid);
        Task<IEnumerable<GetTopTrackerTaskEntrywithtasklistid_Result>> GetTopTrackerTaskEntrywithtasklistid(int EID, int tasklistid);
        Task<IEnumerable<GetTrackerProjectwithprojectid_Result>> GetTrackerProjectwithprojectid(int PID);
        Task<IEnumerable<GetInvoiceDetailbyemployer_Result>> GetInvoiceDetailbyemployer(DateTime FromDate, DateTime ToDate, int PID);
        Task<IEnumerable<GetInvoiceDetailbysubproject_Result>> GetInvoiceDetailbysubproject(DateTime FromDate, DateTime ToDate, int PID);
        Task<IEnumerable<GetEmployeeTaskSummaryByDate_Result>> GetEmployeeTaskSummaryByDate(DateTime FromDate, DateTime ToDate);
        Task<IEnumerable<GetEmployeeBreakupsTaskSummaryByDate_Result>> GetEmployeeBreakupsTaskSummaryByDate(DateTime FromDate, DateTime ToDate);
        //added by GJ 03-31-2022 --10 NO report
        Task<IEnumerable<sp_GetEmployeeTaskSummaryByDate_Result>> Sp_GetEmployeeTaskSummaryByDate(DateTime FromDate, DateTime ToDate);
        //added by GJ
        Task<IEnumerable<GetUserTrackerTaskbyMonth_Result>> GetUserTrackerTaskwithAmount(int EID, DateTime FromDate, DateTime ToDate);

        //added by GJ 2022 08-16

        Task<IEnumerable<GetUtilizationReportDetailwithProjectbyEmployee_Result>> GetReportDetailwithProjectbyEmployee(DateTime FromDate, DateTime ToDate, int EID, int Subprojectid);


        // GJ updates 2022 08-30
        Task<IEnumerable<GetUtilizationReportDetailwithProjectbyEmployee_Result>> employeecost(DateTime FromDate, DateTime ToDate, int EID);

        // GJ updates 2022 09-29
        Task<IEnumerable<GetTrackerTaskbyMonthbyGJ_Result>> GetTrackerTaskbyMonthSC(DateTime FromDate, DateTime ToDate, int PID, int active);
        Task<IEnumerable<GetCompanyincomevsCompanycost_Result>> GetCompanyIncomeVSCompanycost(DateTime FromDate, DateTime ToDate, int EID, int UID, int Projrctid, int Subprojectid);
        Task<IEnumerable<GetBillableHoursAndAmountByProject_Result>> GetBillabletotalHoursAndAmountByProject(DateTime start, DateTime end);
        //Task activity for client user
        Task<IEnumerable<GetActiveLogOfClientProject_Results>> GetActiveLogOfClientProject(DateTime FromDate, DateTime ToDate, int EID, int UID, int AdminID);


    }
}
