using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.EmployeeAttendance
{
    public interface IEmployeeAttendanceService : IEntityService<TblEmployeeAttendance>
    {
        Task<TblEmployeeAttendance> Get(int id);
        Task<bool> tblinsert(TblEmployeeAttendance tbl);
        Task<bool> tblupdate(TblEmployeeAttendance tbl);
        Task<bool> tbldelete(int id);
        Task<TblEmployeeAttendance> GetByEmpAndMonthYear(int empId, int month, int year);
        Task<bool> UpsertAttendance(TblEmployeeAttendance entity);
        Task<IEnumerable<spa_getemployeeattendance_records_Result>> GetEmployeeAttendanceRecords(int? month = null, int? year = null, string search = null);
        Task<IEnumerable<spa_getemployeeattendance_Result>> GetEmployeeAttendanceList(int? month = null, int? year = null, int pageNumber = 1, int pageSize = 100, string search = null);
    }
}
