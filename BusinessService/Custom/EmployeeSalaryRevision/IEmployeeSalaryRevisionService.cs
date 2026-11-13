using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.EmployeeSalaryRevision
{
    public interface IEmployeeSalaryRevisionService : IEntityService<TblEmployeeSalaryRevision>
    {
        Task<TblEmployeeSalaryRevision> Get(long id);
        Task<bool> tblinsert(TblEmployeeSalaryRevision tbl);
        Task<bool> tblupdate(TblEmployeeSalaryRevision tbl);
        Task<bool> tbldelete(long id);
        Task<IEnumerable<TblEmployeeSalaryRevision>> GetSalaryRevisionsByEmpId(int empId);
        Task<TblEmployeeSalaryRevision> GetActiveSalaryRevision(int empId);
        Task<IEnumerable<TblEmployeeSalaryRevision>> GetAllSalaryRevisions(int? empId = null);
        Task<bool> AddOrUpdateSalaryRevision(TblEmployeeSalaryRevision tbl);
        Task<IEnumerable<spa_getemployeesalaryrevision_records_Result>> GetSalaryRevisionRecords(int? employeeId = null, string search = null);
        Task<IEnumerable<spa_getemployeesalaryrevision_Result>> GetSalaryRevisionList(int? employeeId = null, int pageNumber = 1, int pageSize = 100, string search = null);
    }
}
