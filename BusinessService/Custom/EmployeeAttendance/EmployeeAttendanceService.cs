using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.EmployeeAttendance
{
    public class EmployeeAttendanceService : EntityService<TblEmployeeAttendance>, IEmployeeAttendanceService
    {
        readonly IGenericStoredProcedureRepository<TblEmployeeAttendance> spRepository;
        readonly IGenericRepository<TblEmployeeAttendance> repository;
        readonly IUnitOfWork unitOfWork;

        public EmployeeAttendanceService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployeeAttendance> _repository, IGenericStoredProcedureRepository<TblEmployeeAttendance> _spRepository = null)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployeeAttendance> Get(int id)
        {
            return await repository.SelectById(id);
        }

        public async Task<bool> tblinsert(TblEmployeeAttendance tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> tblupdate(TblEmployeeAttendance tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> tbldelete(int id)
        {
            try
            {
                var entity = await Get(id);
                if (entity != null)
                {
                    await Delete(entity);
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<TblEmployeeAttendance> GetByEmpAndMonthYear(int empId, int month, int year)
        {
            var result = repository.FindBy(x => x.EmpId == empId && x.Month == month && (x.Year == year || x.Year == null))
                                   .OrderByDescending(x => x.Id)
                                   .FirstOrDefault();
            return await Task.FromResult(result);
        }

        public async Task<bool> UpsertAttendance(TblEmployeeAttendance entity)
        {
            try
            {
                int targetYear = entity.Year ?? DateTime.Now.Year;
                var existing = await GetByEmpAndMonthYear(entity.EmpId, entity.Month, targetYear);
                if (existing != null)
                {
                    existing.WorkingDays = entity.WorkingDays;
                    existing.Attendance = entity.Attendance;
                    existing.Pl = entity.Pl;
                    existing.Cl = entity.Cl;
                    existing.Sl = entity.Sl;
                    existing.UpdatedBy = entity.UpdatedBy;
                    existing.UpdatedDate = DateTime.Now;
                    return await tblupdate(existing);
                }
                else
                {
                    entity.UpdatedDate = DateTime.Now;
                    return await tblinsert(entity);
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<IEnumerable<spa_getemployeeattendance_records_Result>> GetEmployeeAttendanceRecords(int? month = null, int? year = null, string search = null)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<spa_getemployeeattendance_records_Result>(
                    "exec dbo.spa_getemployeeattendance_records @Month, @Year, @search",
                    new SqlParameter("@Month", (object)month ?? DBNull.Value),
                    new SqlParameter("@Year", (object)year ?? DBNull.Value),
                    new SqlParameter("@search", (object)search ?? DBNull.Value)
                );
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<IEnumerable<spa_getemployeeattendance_Result>> GetEmployeeAttendanceList(int? month = null, int? year = null, int pageNumber = 1, int pageSize = 100, string search = null)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<spa_getemployeeattendance_Result>(
                    "exec dbo.spa_getemployeeattendance @Month, @Year, @PageNumber, @PageSize, @search",
                    new SqlParameter("@Month", (object)month ?? DBNull.Value),
                    new SqlParameter("@Year", (object)year ?? DBNull.Value),
                    new SqlParameter("@PageNumber", pageNumber),
                    new SqlParameter("@PageSize", pageSize),
                    new SqlParameter("@search", (object)search ?? DBNull.Value)
                );
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
