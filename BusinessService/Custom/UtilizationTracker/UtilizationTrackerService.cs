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

namespace BusinessService.Custom.UtilizationTracker
{
    public class UtilizationTrackerService : EntityService<TblToptrackerTask>, IUtilizationTrackerService
    {
        readonly IGenericStoredProcedureRepository<TblToptrackerTask> spRepository;
        readonly IGenericRepository<TblToptrackerTask> repository;
        readonly IUnitOfWork unitOfWork;



        public UtilizationTrackerService(IUnitOfWork _unitOfWork, IGenericRepository<TblToptrackerTask> _repository, IGenericStoredProcedureRepository<TblToptrackerTask> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblToptrackerTask> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblToptrackerTask tbl)
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

        public async Task<bool> tblupdate(TblToptrackerTask tbl)
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


        public async Task<IEnumerable<GetTopTrackerTaskEntry_Result>> GetTopTrackerTaskEntrylist(int eid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTopTrackerTaskEntry_Result>("exec GetTopTrackerTaskEntry @EmpID", new SqlParameter("@EmpID", eid));
        }
        public async Task<IEnumerable<GetProjectTaskWithDuration_Result>> GetProjectTaskWithDuration(int eid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetProjectTaskWithDuration_Result>("exec GetProjectTaskWithDuration @empid", new SqlParameter("@empid", eid));
        }
        public async Task<IEnumerable<GetTrackerSummarybyMonth_Result>> GetTrackerSummarybyMonth(DateTime FromDate, DateTime ToDate, int Pid, int active)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTrackerSummarybyMonth_Result>("exec GetTrackerSummarybyMonth @ProjectID,@start,@end,@active", new SqlParameter("@ProjectID", Pid), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@active", active));
        }
        public async Task<IEnumerable<GetTrackerTaskbyMonth_Result>> GetTrackerTaskbyMonth(DateTime FromDate, DateTime ToDate, int Pid, int active)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTrackerTaskbyMonth_Result>("exec GetTrackerTaskbyMonth @ProjectID,@start,@end,@active", new SqlParameter("@ProjectID", Pid), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@active", active));
        }
        public async Task<IEnumerable<GetAttendanceReport_Result>> GetAttendanceReport(int month, int year)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetAttendanceReport_Result>("exec GetAttendanceReport @month,@year", new SqlParameter("@month", month), new SqlParameter("@year", year));
        }
        public async Task<IEnumerable<GetSummaryOfEmployeeTask_Result>> GetSummaryOfEmployeeTask(DateTime FromDate, DateTime ToDate, int Eid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetSummaryOfEmployeeTask_Result>("exec GetSummaryOfEmployeeTask @start,@end,@Employeeid", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", Eid));
        }
        //Girish - 01202022
        public async Task<IEnumerable<GetActiveLogOfEmployee_Result>> GetActiveLogOfEmployee(DateTime FromDate, DateTime ToDate, int Eid, int UID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetActiveLogOfEmployee_Result>("exec GetActiveLogOfEmployee @start,@end,@Employeeid,@utype", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", Eid), new SqlParameter("@utype", UID));
        }

        //added for test 202306-23 GJ
        public async Task<IEnumerable<GetActiveLogOfEmployee_VC_Result>> GetActiveLogOfEmployeeclient(DateTime FromDate, DateTime ToDate, int Eid, int UID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetActiveLogOfEmployee_VC_Result>("exec GetActiveLogOfEmployee_VC @start,@end,@Employeeid,@utype", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", Eid), new SqlParameter("@utype", UID));
        }

        //Girish -02-16-2022
        public async Task<IEnumerable<GetUtilizationReportwithProject_Result>> GetUtilizationReportSummarywithProject (DateTime FromDate, DateTime ToDate, int Eid, int Projrctid, int Subprojectid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUtilizationReportwithProject_Result>("exec GetUtilizationReportwithProject @start,@end,@Employeeid,@projrctid,@subprojectid", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", Eid), new SqlParameter("@projrctid", Projrctid), new SqlParameter("@subprojectid", Subprojectid));
        }

        public async Task<IEnumerable<GetUtilizationReportDetailwithProject_Result>> GetUtilizationReportwithDetailProject(DateTime FromDate, DateTime ToDate, int Eid, int UID, int Projrctid, int Subprojectid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUtilizationReportDetailwithProject_Result>("exec GetUtilizationReportDetailwithProject @start,@end,@Employeeid,@utype,@projrctid,@subprojectid", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", Eid), new SqlParameter("@utype", UID), new SqlParameter("@projrctid", Projrctid), new SqlParameter("@subprojectid", Subprojectid));
        }
        public async Task<IEnumerable<GetTopTrackerTaskEntrywithtasklistid_Result>> GetTopTrackerTaskEntrywithtasklistid(int eid, int tasklistid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTopTrackerTaskEntrywithtasklistid_Result>("exec GetTopTrackerTaskEntrywithtasklistid @EmpID,@tasklistid", new SqlParameter("@EmpID", eid), new SqlParameter("@tasklistid", tasklistid));
        }
        public async Task<IEnumerable<GetTrackerProjectwithprojectid_Result>> GetTrackerProjectwithprojectid(int PID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTrackerProjectwithprojectid_Result>("exec GetTrackerProjectwithprojectid @projectid", new SqlParameter("@projectid", PID));
        }
        public async Task<IEnumerable<GetInvoiceDetailbyemployer_Result>> GetInvoiceDetailbyemployer(DateTime FromDate, DateTime ToDate, int Pid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetInvoiceDetailbyemployer_Result>("exec GetInvoiceDetailbyemployer @ProjectID,@start,@end", new SqlParameter("@ProjectID", Pid), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate));
        }
        public async Task<IEnumerable<GetInvoiceDetailbysubproject_Result>> GetInvoiceDetailbysubproject(DateTime FromDate, DateTime ToDate, int Pid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetInvoiceDetailbysubproject_Result>("exec GetInvoiceDetailbysubproject @ProjectID,@start,@end", new SqlParameter("@ProjectID", Pid), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate));
        }
        public async Task<IEnumerable<GetEmployeeTaskSummaryByDate_Result>> GetEmployeeTaskSummaryByDate(DateTime FromDate, DateTime ToDate)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetEmployeeTaskSummaryByDate_Result>("exec GetEmployeeTaskSummaryByDate @start,@end", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate));
            }
            catch (Exception ex)
            {
                throw ex;
            }
           
        }
        public async Task<IEnumerable<GetEmployeeBreakupsTaskSummaryByDate_Result>> GetEmployeeBreakupsTaskSummaryByDate(DateTime FromDate, DateTime ToDate)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetEmployeeBreakupsTaskSummaryByDate_Result>("exec GetEmployeeBreakupsTaskSummaryByDate @start,@end", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate));
        }

        public async Task<int> tblinsert4watcher(TblToptrackerTask tbl)
        {
            try
            {
                await Create(tbl);
                return tbl.Id;
            }
            catch (Exception)
            {
                return 0;
            }
        }
        //added by GJ 2022 04-25
        public async Task<IEnumerable<GetUserTrackerTaskbyMonth_Result>> GetUserTrackerTaskwithAmount(int EID, DateTime FromDate, DateTime ToDate)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetUserTrackerTaskbyMonth_Result>("exec GetUserTrackerTaskbyMonth @ID,@start,@end", new SqlParameter("@ID", EID), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate));
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //added by GJ 2022 08-16
        public async Task<IEnumerable<GetUtilizationReportDetailwithProjectbyEmployee_Result>> GetReportDetailwithProjectbyEmployee(DateTime FromDate, DateTime ToDate, int EID, int Subprojectid)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetUtilizationReportDetailwithProjectbyEmployee_Result>("exec GetUtilizationReportDetailwithProjectbyEmployee @start,@end,@Employeeid,@subprojectid", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", EID), new SqlParameter("@subprojectid", Subprojectid));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        // GJ updates 2022 08-30
        public async Task<IEnumerable<GetUtilizationReportDetailwithProjectbyEmployee_Result>> employeecost(DateTime FromDate, DateTime ToDate, int EID)
        {
            try
            {
                //return await spRepository.ExecWithStoreProcedureAsync<GetUtilizationReportDetailwithProjectbyEmployee_Result>("exec GetUtilizationReportDetailwithProjectbyEmployee @start,@end", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", EID));
                return await spRepository.ExecWithStoreProcedureAsync<GetUtilizationReportDetailwithProjectbyEmployee_Result>("exec GetUtilizationReportDetailwithProjectbyEmployee @start,@end", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", EID));
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<IEnumerable<GetTrackerTaskbyMonthbyGJ_Result>> GetTrackerTaskbyMonthSC(DateTime FromDate, DateTime ToDate, int Pid, int active)
        //{
        //    return await spRepository.ExecWithStoreProcedureAsync<GetTrackerTaskbyMonthGJ_Result>("exec GetTrackerTaskbyMonthGJ @ProjectID,@start,@end,@active", new SqlParameter("@ProjectID", Pid), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@active", active));
        //}
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetTrackerTaskbyMonthbyGJ_Result>("exec GetTrackerTaskbyMonthbyGJ @ProjectID,@start,@end,@active", new SqlParameter("@ProjectID", Pid), new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@active", active));
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public async Task<IEnumerable<sp_GetEmployeeTaskSummaryByDate_Result>> Sp_GetEmployeeTaskSummaryByDate(DateTime FromDate, DateTime ToDate)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_GetEmployeeTaskSummaryByDate_Result>("exec sp_GetEmployeeTaskSummaryByDate @start,@end", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate));
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<IEnumerable<GetCompanyincomevsCompanycost_Result>> GetCompanyIncomeVSCompanycost(DateTime FromDate, DateTime ToDate, int Eid, int UID, int Projrctid, int Subprojectid)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetCompanyincomevsCompanycost_Result>("exec GetCompanyincomevsCompanycost @start,@end,@Employeeid,@utype,@projrctid,@subprojectid", new SqlParameter("@start", FromDate), new SqlParameter("@end", ToDate), new SqlParameter("@Employeeid", Eid), new SqlParameter("@utype", UID), new SqlParameter("@projrctid", Projrctid), new SqlParameter("@subprojectid", Subprojectid));
        }


        //public async Task<bool> tblinsertactual(TblProjectedvsActual tbl)
        //{
        //    try
        //    {
        //        await Create(tbl);
        //        return true;
        //    }
        //    catch (Exception)
        //    {
        //        return false;
        //    }

        //}

        //public async Task<bool> tblupdateactual(TblProjectedvsActual tbl)
        //{
        //    try
        //    {
        //        await Update(tbl);
        //        return true;
        //    }
        //    catch (Exception)
        //    {
        //        return false;
        //    }

        //}

        //new for graph total hours by client

        public async Task<IEnumerable<GetBillableHoursAndAmountByProject_Result>> GetBillabletotalHoursAndAmountByProject(DateTime start, DateTime end)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetBillableHoursAndAmountByProject_Result>(
                "exec GetBillableHoursAndAmountByProject @start,@end",
                new SqlParameter("@start", start),
                new SqlParameter("@end", end)
            );
        }
        
        
        //Task activity for client user
        public async Task<IEnumerable<GetActiveLogOfClientProject_Results>> GetActiveLogOfClientProject(DateTime FromDate, DateTime ToDate, int Eid, int Uid, int AdminId)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetActiveLogOfClientProject_Results>(
                "exec GetActiveLogOfClientProject @start, @end, @Employeeid, @utype, @adminId",
                new SqlParameter("@start", FromDate),
                new SqlParameter("@end", ToDate),
                new SqlParameter("@Employeeid", Eid),
                new SqlParameter("@utype", Uid),
                new SqlParameter("@adminId", AdminId)
            );
        }

        public async Task<IEnumerable<spa_getactivelogofemployee_records_Result>> GetActiveLogOfEmployeeRecords(DateTime? start, DateTime? end, int? employeeId = null, int utype = 3, string search = null)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<spa_getactivelogofemployee_records_Result>(
                    "exec spa_getactivelogofemployee_records @start, @end, @Employeeid, @utype, @search",
                    new SqlParameter("@start", (object)start ?? DBNull.Value),
                    new SqlParameter("@end", (object)end ?? DBNull.Value),
                    new SqlParameter("@Employeeid", (object)employeeId ?? DBNull.Value),
                    new SqlParameter("@utype", utype),
                    new SqlParameter("@search", (object)search ?? DBNull.Value)
                );
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<spa_getactivelogofemployee_Result>> GetActiveLogOfEmployeeWithPagination(DateTime? start, DateTime? end, int? employeeId = null, int utype = 3, int pageNumber = 1, int pageSize = 100, string search = null)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<spa_getactivelogofemployee_Result>(
                    "exec spa_getactivelogofemployee @start, @end, @Employeeid, @utype, @PageNumber, @PageSize, @search",
                    new SqlParameter("@start", (object)start ?? DBNull.Value),
                    new SqlParameter("@end", (object)end ?? DBNull.Value),
                    new SqlParameter("@Employeeid", (object)employeeId ?? DBNull.Value),
                    new SqlParameter("@utype", utype),
                    new SqlParameter("@PageNumber", pageNumber),
                    new SqlParameter("@PageSize", pageSize),
                    new SqlParameter("@search", (object)search ?? DBNull.Value)
                );
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
