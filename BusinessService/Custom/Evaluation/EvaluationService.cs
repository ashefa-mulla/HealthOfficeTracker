using BusinessApp.Data;
using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace BusinessService.Custom.Evaluation
{
    public class EvaluationService : EntityService<TblEvaluationSubmission>, IEvaluationService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEvaluationSubmission> spRepository;
        private readonly GenericRepository<TblEvaluationSubmission> genericRepository;
        readonly IGenericRepository<TblEvaluationSubmission> repository;


        public EvaluationService(IUnitOfWork _unitOfWork, IGenericRepository<TblEvaluationSubmission> _repository,
            IGenericStoredProcedureRepository<TblEvaluationSubmission> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }
        public async Task<TblEvaluationSubmission> Get(int ID)
        {
            //return await repository.SelectById(ID);
            return await Task.Run(() => unitOfWork.ctx.TblEvaluationSubmissions.Where(o => o.Id == ID)
                       .FirstOrDefault());
        }

        public async Task<bool> tblInsert(TblEvaluationSubmission tbl)
        {
            try
            {
                tbl.UpdatedDate = DateOnly.FromDateTime(DateTime.UtcNow);  // or DateTime.Now depending on your needs
                await Create(tbl);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> tblUpdate(TblEvaluationSubmission tbl)
        {
            try
            {
                tbl.UpdatedDate = DateOnly.FromDateTime(DateTime.UtcNow);  // update timestamp whenever record is modified
                await Update(tbl);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> tblDelete(int id)
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

        public async Task<IEnumerable<sp_getevaluationquestionsbyemployee_Results>> GetEvaluationQuestionsByEmployee(int empId)
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_getevaluationquestionsbyemployee_Results>(
                "exec sp_getevaluationquestionsbyemployee @EmployeeID",
                new SqlParameter("@EmployeeID", empId)
            );
        }

        public async Task<IEnumerable<sp_getevaluationsubmissionsforedit_Results>> GetEvaluationsForEdit(int? empId, DateTime startDate, DateTime endDate)
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_getevaluationsubmissionsforedit_Results>(
                "exec sp_getevaluationsubmissionsforedit @EmployeeID, @StartDate, @EndDate",
                new SqlParameter("@EmployeeID", (object)empId ?? DBNull.Value),
                new SqlParameter("@StartDate", startDate),
                new SqlParameter("@EndDate", endDate)
            );
        }

        public async Task<IEnumerable<sp_getlast8evaluationssummary_Results>> Getlast8EvaluationsSummary(int empId)
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_getlast8evaluationssummary_Results>(
                "exec sp_getlast8evaluationssummary @EmployeeID",
                new SqlParameter("@EmployeeID", empId)
            );
        }

        //new added

        //public async Task<IEnumerable<sp_getmonthlyevaluationsummary_Result>> GetMonthlyEvaluationSummary(int? empId, int evalYear, int evalMonth)
        //{
        //    return await spRepository.ExecWithStoreProcedureAsync<sp_getmonthlyevaluationsummary_Result>(
        //        "exec sp_getMonthlyEvaluationSummary @EmployeeID, @EvalYear, @EvalMonth",
        //        new SqlParameter("@EmployeeID", (object)empId ?? DBNull.Value),
        //        new SqlParameter("@EvalYear", evalYear),
        //        new SqlParameter("@EvalMonth", evalMonth)
        //    );
        //}


        //public async Task<IEnumerable<sp_getmonthlyevaluationsummary_Result>> GetMonthlyEvaluationSummary(int empId, int evalYear, int evalMonth)
        //{
        //    return await spRepository.ExecWithStoreProcedureAsync<sp_getmonthlyevaluationsummary_Result>(
        //        "exec sp_getmonthlyevaluationsummary @EmployeeID, @EvalYear ,@EvalMonth",
        //        new SqlParameter("@EmployeeID", empId),
        //        new SqlParameter("@EvalYear", evalYear),
        //        new SqlParameter("@EvalMonth", evalMonth)
        //    );
        //}


        public async Task<IEnumerable<sp_getmonthlyevaluationsummary_Result>> GetMonthlyEvaluationSummary(int? empId, int? evalYear = null, int? evalMonth = null)
        {
            // 🧠 Default to current month/year if not provided
            int year = evalYear ?? DateTime.Now.Year;
            int month = evalMonth ?? DateTime.Now.Month;

            // 🧩 Execute stored procedure safely with parameters
            return await spRepository.ExecWithStoreProcedureAsync<sp_getmonthlyevaluationsummary_Result>(
                "EXEC sp_getmonthlyevaluationsummary @EmployeeID, @EvalYear, @EvalMonth",
                new SqlParameter("@EmployeeID", empId),
                new SqlParameter("@EvalYear", year),
                new SqlParameter("@EvalMonth", month)
            );
        }


        public async Task<int> AddOrUpdateMonthlyEvaluationSubmission(sp_getmonthlyevaluationsummaryaddedit_Result dto)
        {
            // Execute the stored procedure and map result to ResultId wrapper
            var result = await spRepository.ExecWithStoreProcedureAsync<ResultId>(
                "exec sp_getMonthlyEvaluationSummaryAddEdit @ID, @EmployeeID, @QuestionID, @Answer, @Comment, @EvalYear, @EvalMonth, @WeekOfMonth",
                new SqlParameter("@ID", (object)dto.ID ?? DBNull.Value),
                new SqlParameter("@EmployeeID", dto.EmployeeId),
                new SqlParameter("@QuestionID", dto.QuestionId),
                new SqlParameter("@Answer", dto.Answer),
                new SqlParameter("@Comment", (object)dto.Comment ?? DBNull.Value),
                new SqlParameter("@EvalYear", dto.EvalYear),
                new SqlParameter("@EvalMonth", dto.EvalMonth),
                new SqlParameter("@WeekOfMonth", dto.WeekOfMonth)
            );

            // Return the ID returned by the stored procedure (inserted or updated)
            return result.FirstOrDefault()?.Status ?? 0;
        }


        //public async Task<IEnumerable<sp_getmonthlyevaluationreportsummary_Results>> GetMonthlyEvaluationReportSummary(int? Year = null, int? Month = null)
        //{
        //    // 🧠 Default to current month/year if not provided
        //    int year = Year ?? DateTime.Now.Year;
        //    int month = Month ?? DateTime.Now.Month;

        //    // 🧩 Execute stored procedure safely with parameters
        //    return await spRepository.ExecWithStoreProcedureAsync<sp_getmonthlyevaluationreportsummary_Results>(
        //        "EXEC sp_getmonthlyevaluationreportsummary @Year, @Month",                
        //        new SqlParameter("@Year", year),
        //        new SqlParameter("@Month", month)
        //    );
        //}
        public async Task<IEnumerable<sp_getmonthlyevaluationreportsummary_Results>> GetMonthlyEvaluationReportSummary(int? Year = null, int? Month = null)
        {
            int year = Year ?? DateTime.Now.Year;
            int month = Month ?? DateTime.Now.Month;

            if (month < 1 || month > 12)
                throw new ArgumentOutOfRangeException(nameof(Month), "Month must be between 1 and 12");

            return await spRepository.ExecWithStoreProcedureAsync
                <sp_getmonthlyevaluationreportsummary_Results>(
                    "EXEC dbo.sp_getmonthlyevaluationreportsummary @Year, @Month",
                    new SqlParameter("@Year", SqlDbType.Int) { Value = year },
                    new SqlParameter("@Month", SqlDbType.Int) { Value = month }
                );
        }



    }
}
