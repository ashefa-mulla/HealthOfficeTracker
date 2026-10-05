using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Custom.EmployeeMatrix
{
    public interface IEmployeeMatrixService : IEntityService<TblEmployeeMatrix>
    {
        Task<TblEmployeeMatrix> Get(int ID);
        Task<TblEmployeeMatrix> GetRecruitbyId(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblEmployeeMatrix tbl);
        Task<bool> tblupdate(TblEmployeeMatrix tbl);
        Task<IEnumerable<sp_getdailyemployeematrixlist>> DailyMatrixlist(int employerid, DateTime evaluationdate);
        Task<IEnumerable<sp_getEmployeematrix>> GetEmployeematrix(int employerid);
        Task<IEnumerable<sp_getemployeematrixlist>> GetMatrixlist(int employerid, DateTime fdate, DateTime tdate);
        Task<IEnumerable<sp_getemployeematrixsummaryreport>> GetMatrixsummarylist(int month,int year);
    }
}
