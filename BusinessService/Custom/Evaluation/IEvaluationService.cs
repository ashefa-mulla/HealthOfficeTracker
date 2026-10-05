using BusinessApp.Data;
using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;



namespace BusinessService.Custom.Evaluation
{
    public interface IEvaluationService : IEntityService<TblEvaluationSubmission>
    {
        Task<TblEvaluationSubmission> Get(int ID);
        Task<bool> tblDelete(int id);
        Task<bool> tblInsert(TblEvaluationSubmission tbl);
        Task<bool> tblUpdate(TblEvaluationSubmission tbl);
        Task<IEnumerable<sp_getevaluationquestionsbyemployee_Results>> GetEvaluationQuestionsByEmployee(int empId);
        Task<IEnumerable<sp_getevaluationsubmissionsforedit_Results>> GetEvaluationsForEdit(int? empId, DateTime startDate, DateTime endDate);

        Task<IEnumerable<sp_getlast8evaluationssummary_Results>> Getlast8EvaluationsSummary(int empId);

        //new update
        //Task<IEnumerable<sp_getmonthlyevaluationsummary_Result>> GetMonthlyEvaluationSummary(int? empId, int evalYear, int evalMonth);
        Task<IEnumerable<sp_getmonthlyevaluationsummary_Result>> GetMonthlyEvaluationSummary(int? empId, int? evalYear, int? evalMonth);
        Task<int> AddOrUpdateMonthlyEvaluationSubmission(sp_getmonthlyevaluationsummaryaddedit_Result dto);
        Task<IEnumerable<sp_getmonthlyevaluationreportsummary_Results>> GetMonthlyEvaluationReportSummary(int? Year, int? Month);



    }
}
