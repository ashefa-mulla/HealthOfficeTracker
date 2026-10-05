using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace BusinessService.Custom.Employee
{
   public interface IEmployeeService : IEntityService<TblEmployer>
    {
        Task<TblEmployer> Get(int ID);
        Task<TblEmployer> GetByUserID(int ID);
        Task<bool> tblDelete(int id);
        Task<bool> tblInsert(TblEmployer tbl);
        Task<bool> tblUpdate(TblEmployer tbl);
        Task<IEnumerable<TblEmployer>> Getbyemployerlist();
        Task<bool> DeActivateEmployer(int id);
        Task<bool> ChangeUsername(string IdentityID, string newUsername);
        Task<IEnumerable<GetEmployerList_Result>> GetEmployerList(int id);
        Task<IEnumerable<GetEmployeeByUserID_Result>> GetEmployeeByUserID(int id);
        Task<IEnumerable<GetOffsetByEmployeeID_Result>> GetOffsetByEmployeeID(int id);
        Task<bool> ChangePassword(string IdentityID, string NewPassword);
        //Task<IEnumerable<sp_get_userforfeedbackform_Results>> Getuserforfeedback();
        //Task<IEnumerable<sp_get_questionsforfeedbackform_Results>> Getquestionsforfeedback();
        //Task<bool> tblInsert(TblMatrix4teamAnswer tbl);
        //Task<bool> tblUpdate(TblMatrix4teamAnswer tbl);


    }
}
