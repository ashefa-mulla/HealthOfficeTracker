using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessData.DataContext;

namespace BusinessService.Custom.EvaluationLock
{
    public interface IEvaluationLockService
    {
        Task<TblEvaluationLock> Get(int id);
        Task<TblEvaluationLock> GetByEmployeeYearMonth(int employeeId, int evalYear, int evalMonth);

        Task<bool> tblinsert(TblEvaluationLock tbl);
        Task<bool> tblupdate(TblEvaluationLock tbl);
        Task<bool> IsLocked(int employeeId, int evalYear, int evalMonth);
    }
}
