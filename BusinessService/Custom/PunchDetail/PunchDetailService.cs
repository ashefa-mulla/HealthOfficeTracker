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

namespace BusinessService.Custom.PunchDetail
{
   public class PunchDetailService : EntityService<TblPunchDetail>, IPunchDetailService
    {
        readonly IGenericStoredProcedureRepository<TblPunchDetail> spRepository;
        readonly IGenericRepository<TblPunchDetail> repository;
        readonly IUnitOfWork unitOfWork;



        public PunchDetailService(IUnitOfWork _unitOfWork, IGenericRepository<TblPunchDetail> _repository, IGenericStoredProcedureRepository<TblPunchDetail> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblPunchDetail> Get(int ID)
        {

            return await repository.SelectById(ID);
        }
        public async Task<bool> tblinsert(TblPunchDetail tbl)
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

        public async Task<bool> tblupdate(TblPunchDetail tbl)
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


        public async Task<IEnumerable<GetPunchDetailList_Result>> GetPunchDetailList(int EID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetPunchDetailList_Result>("exec GetPunchDetailList @EID", new SqlParameter("@EID", EID));
        }
        public async Task<IEnumerable<GetPunchIDForClockOut_Result>> GetPunchIDForClockOut(int EID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetPunchIDForClockOut_Result>("exec GetPunchIDForClockOut @EmpID", new SqlParameter("@EmpID", EID));
        }
        public async Task<IEnumerable<GetDateTimeForClockInOut_Result>> GetDateTimeForClockInOut()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetDateTimeForClockInOut_Result>("exec GetDateTimeForClockInOut");
        }
        public async Task<IEnumerable<GetUserLogReport_Result>> GetUserLogReport(DateTime FromDate, DateTime ToDate)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUserLogReport_Result>("exec GetUserLogReport @FromDate,@ToDate", new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate));
        }
        public async Task<IEnumerable<GetUserLogReportByEmpID_Result>> GetUserLogReportByEmpID(DateTime FromDate, DateTime ToDate, int EID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUserLogReportByEmpID_Result>("exec GetUserLogReportByEmpID @FromDate,@ToDate,@EID", new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate), new SqlParameter("@EID", EID));
        }
        public async Task<IEnumerable<GetTimeLogByEmployeeID_Result>> GetTimeLogByEmployeeID(int EID, DateTime FromDate, DateTime ToDate)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetTimeLogByEmployeeID_Result>("exec GetTimeLogByEmployeeID @EID,@FromDate,@ToDate", new SqlParameter("@EID", EID), new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate));
        }
        public async Task<IEnumerable<GetEventsList_Result>> GetEventsList()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetEventsList_Result>("exec GetEventsList");
        }
        public async Task<IEnumerable<GetHrsBreaklyTimeLogByEmpID_Result>> GetHrsBreaklyTimeLogByEmpID(int EID, DateTime FromDate, DateTime ToDate)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetHrsBreaklyTimeLogByEmpID_Result>("exec GetHrsBreaklyTimeLogByEmpID @EID,@FromDate,@ToDate", new SqlParameter("@EID", EID), new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate));
        }
        public async Task<IEnumerable<GetUserLogWithCaptureImg_Result>> GetUserLogWithCaptureImg()
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetUserLogWithCaptureImg_Result>("exec GetUserLogWithCaptureImg");
        }
        public async Task<IEnumerable<GetCompanyBranchListByCompanyID_Result>> GetCompanyBranchListByCompanyID(int CID)
        {
            return await spRepository.ExecWithStoreProcedureAsync<GetCompanyBranchListByCompanyID_Result>("exec GetCompanyBranchListByCompanyID @CID", new SqlParameter("@CID", CID));
        }
    }
}
