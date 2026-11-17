using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.EmployeeMonthlyAllowance
{
    public interface IEmployeeMonthlyAllowanceService : IEntityService<TblEmployeeMonthlyAllowance>
    {
        Task<TblEmployeeMonthlyAllowance> Get(long id);
        Task<IEnumerable<TblEmployeeMonthlyAllowance>> GetAll(int? empId = null, int? month = null, int? year = null, long? allowanceId = null, bool? isActive = true);
        Task<bool> tblinsert(TblEmployeeMonthlyAllowance tbl);
        Task<bool> tblupdate(TblEmployeeMonthlyAllowance tbl);
        Task<bool> tbldelete(long id);
        Task<bool> AddOrUpdateMonthlyAllowance(TblEmployeeMonthlyAllowance tbl);
        Task<IEnumerable<TblAllowanceMaster>> GetMonthlyAllowanceMasterList();
        Task<IEnumerable<sp_GetEmployeeMonthlyAllowance_Result>> GetEmployeeMonthlyAllowance(int empId, int month, int year);
    }
}
