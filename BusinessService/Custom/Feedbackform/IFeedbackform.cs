using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace BusinessService.Custom.Feedbackform
{
    public interface IFeedbackformService : IEntityService<TblMatrix4teamAnswer>
    {
        Task<TblMatrix4teamAnswer> Get(int ID);
        //Task<TblMatrix4teamAnswer> GetByUserID(int ID);
        Task<bool> tblDelete(int id);
        Task<bool> tblInsert(TblMatrix4teamAnswer tbl);
        Task<bool> tblUpdate(TblMatrix4teamAnswer tbl);
        Task<IEnumerable<sp_get_userforfeedbackform_Results>> Getuserforfeedback();
        Task<IEnumerable<sp_get_questionsforfeedbackform_Results>> Getquestionsforfeedback();

    }
}
