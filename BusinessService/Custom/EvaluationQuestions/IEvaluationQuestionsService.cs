using BusinessApp.Data;
using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace BusinessService.Custom.EvaluationQuestions
{
    public interface IEvaluationQuestionsService : IEntityService<TblEvaluationQuestion>
    {
        Task<TblEvaluationQuestion> Get(int ID);
        Task<IEnumerable<TblEvaluationQuestion>> tblGetAll();
        Task<bool> tblDelete(int id);
        Task<bool> tblInsert(TblEvaluationQuestion tbl);
        Task<bool> tblUpdate(TblEvaluationQuestion tbl);
        Task<bool> ToggleEvaluationQuestionStatus(int id);   // ✅ NEW

    }
}
