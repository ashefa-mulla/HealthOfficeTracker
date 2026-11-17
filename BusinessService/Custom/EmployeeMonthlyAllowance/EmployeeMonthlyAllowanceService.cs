using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Custom.EmployeeMonthlyAllowance
{
    public class EmployeeMonthlyAllowanceService : EntityService<TblEmployeeMonthlyAllowance>, IEmployeeMonthlyAllowanceService
    {
        private readonly IGenericStoredProcedureRepository<TblEmployeeMonthlyAllowance> spRepository;
        private readonly IGenericRepository<TblEmployeeMonthlyAllowance> repository;
        private readonly IUnitOfWork unitOfWork;

        public EmployeeMonthlyAllowanceService(
            IUnitOfWork _unitOfWork,
            IGenericRepository<TblEmployeeMonthlyAllowance> _repository,
            IGenericStoredProcedureRepository<TblEmployeeMonthlyAllowance> _spRepository = null)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployeeMonthlyAllowance> Get(long id)
        {
            return await unitOfWork.ctx.TblEmployeeMonthlyAllowances
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<TblEmployeeMonthlyAllowance>> GetAll(
            int? empId = null,
            int? month = null,
            int? year = null,
            long? allowanceId = null,
            bool? isActive = true)
        {
            var query = unitOfWork.ctx.TblEmployeeMonthlyAllowances
                .AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            if (empId.HasValue && empId.Value > 0)
            {
                query = query.Where(x => x.EmpId == empId.Value);
            }

            if (month.HasValue && month.Value > 0)
            {
                query = query.Where(x => x.Month == month.Value);
            }

            if (year.HasValue && year.Value > 0)
            {
                query = query.Where(x => x.Year == year.Value);
            }

            if (allowanceId.HasValue && allowanceId.Value > 0)
            {
                query = query.Where(x => x.AllowanceId == allowanceId.Value);
            }

            return await query
                .OrderByDescending(x => x.Year)
                .ThenByDescending(x => x.Month)
                .ThenBy(x => x.EmpId)
                .ToListAsync();
        }

        public async Task<bool> tblinsert(TblEmployeeMonthlyAllowance tbl)
        {
            try
            {
                tbl.CreatedDate = DateTime.Now;
                await Create(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> tblupdate(TblEmployeeMonthlyAllowance tbl)
        {
            try
            {
                tbl.UpdatedDate = DateTime.Now;
                await Update(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> tbldelete(long id)
        {
            try
            {
                var entity = await repository.SelectById(id);
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

        public async Task<bool> AddOrUpdateMonthlyAllowance(TblEmployeeMonthlyAllowance tbl)
        {
            try
            {
                if (tbl.Id != 0)
                {
                    var existing = await repository.SelectById(tbl.Id);
                    if (existing == null)
                    {
                        return false;
                    }

                    existing.EmpId = tbl.EmpId;
                    existing.AllowanceId = tbl.AllowanceId;
                    existing.Month = tbl.Month;
                    existing.Year = tbl.Year;
                    existing.Amount = tbl.Amount;
                    existing.IsActive = tbl.IsActive;
                    existing.UpdatedBy = tbl.UpdatedBy;
                    existing.UpdatedDate = DateTime.Now;

                    await Update(existing);
                    tbl.CreatedDate = existing.CreatedDate;
                    tbl.CreatedBy = existing.CreatedBy;
                    tbl.UpdatedDate = existing.UpdatedDate;
                    return true;
                }
                else
                {
                    // Check if duplicate entry exists for this EmpId + AllowanceId + Month + Year
                    var existing = await unitOfWork.ctx.TblEmployeeMonthlyAllowances
                        .FirstOrDefaultAsync(x => x.EmpId == tbl.EmpId
                                               && x.AllowanceId == tbl.AllowanceId
                                               && x.Month == tbl.Month
                                               && x.Year == tbl.Year);

                    if (existing != null)
                    {
                        existing.Amount = tbl.Amount;
                        existing.IsActive = tbl.IsActive;
                        existing.UpdatedBy = tbl.UpdatedBy ?? tbl.CreatedBy;
                        existing.UpdatedDate = DateTime.Now;

                        await Update(existing);
                        tbl.Id = existing.Id;
                        tbl.CreatedDate = existing.CreatedDate;
                        tbl.CreatedBy = existing.CreatedBy;
                        tbl.UpdatedDate = existing.UpdatedDate;
                        return true;
                    }
                    else
                    {
                        tbl.CreatedDate = DateTime.Now;
                        await Create(tbl);
                        return true;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }


        public async Task<IEnumerable<TblAllowanceMaster>> GetMonthlyAllowanceMasterList()
        {
            return await unitOfWork.ctx.TblAllowanceMasters
                .Where(x => x.IsMonthlyAllowance && x.IsActive)
                .OrderBy(x => x.AllowanceName)
                .ToListAsync();
        }

        public async Task<IEnumerable<sp_GetEmployeeMonthlyAllowance_Result>> GetEmployeeMonthlyAllowance(int empId, int month, int year)
        {
            try
            {
                var pEmpId = new SqlParameter("@Emp_ID", empId);
                var pMonth = new SqlParameter("@Month", month);
                var pYear = new SqlParameter("@Year", year);

                IEnumerable<sp_GetEmployeeMonthlyAllowance_Result> list;
                if (spRepository != null)
                {
                    list = await spRepository.ExecWithStoreProcedureAsync<sp_GetEmployeeMonthlyAllowance_Result>(
                        "EXEC dbo.sp_GetEmployeeMonthlyAllowance @Emp_ID, @Month, @Year",
                        pEmpId, pMonth, pYear
                    );
                }
                else
                {
                    list = await unitOfWork.ctx.Set<sp_GetEmployeeMonthlyAllowance_Result>()
                        .FromSqlRaw("EXEC dbo.sp_GetEmployeeMonthlyAllowance @Emp_ID, @Month, @Year", pEmpId, pMonth, pYear)
                        .AsNoTracking()
                        .ToListAsync();
                }

                var result = list?.ToList() ?? new List<sp_GetEmployeeMonthlyAllowance_Result>();
                foreach (var item in result)
                {
                    item.Month = month;
                    item.Year = year;
                }

                return result;
            }
            catch (Exception)
            {
                return new List<sp_GetEmployeeMonthlyAllowance_Result>();
            }
        }
    }
}
