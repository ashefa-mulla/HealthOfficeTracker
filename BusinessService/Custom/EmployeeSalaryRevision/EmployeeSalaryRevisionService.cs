using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.EmployeeSalaryRevision
{
    public class EmployeeSalaryRevisionService : EntityService<TblEmployeeSalaryRevision>, IEmployeeSalaryRevisionService
    {
        readonly IGenericStoredProcedureRepository<TblEmployeeSalaryRevision> spRepository;
        readonly IGenericRepository<TblEmployeeSalaryRevision> repository;
        readonly IUnitOfWork unitOfWork;

        public EmployeeSalaryRevisionService(
            IUnitOfWork _unitOfWork,
            IGenericRepository<TblEmployeeSalaryRevision> _repository,
            IGenericStoredProcedureRepository<TblEmployeeSalaryRevision> _spRepository = null)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployeeSalaryRevision> Get(long id)
        {
            return await repository.SelectById(id);
        }

        public async Task<bool> tblinsert(TblEmployeeSalaryRevision tbl)
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

        public async Task<bool> tblupdate(TblEmployeeSalaryRevision tbl)
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

        public async Task<bool> tbldelete(long id)
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

        public async Task<IEnumerable<TblEmployeeSalaryRevision>> GetSalaryRevisionsByEmpId(int empId)
        {
            var revisions = repository.FindBy(x => x.EmpId == empId)
                                      .OrderByDescending(x => x.SeqNo)
                                      .ThenByDescending(x => x.FromDate)
                                      .ToList();
            return await Task.FromResult(revisions.AsEnumerable());
        }

        public async Task<TblEmployeeSalaryRevision> GetActiveSalaryRevision(int empId)
        {
            var active = repository.FindBy(x => x.EmpId == empId && x.IsActive)
                                   .OrderByDescending(x => x.SeqNo)
                                   .FirstOrDefault();
            return await Task.FromResult(active);
        }

        public async Task<IEnumerable<TblEmployeeSalaryRevision>> GetAllSalaryRevisions(int? empId = null)
        {
            var query = repository.SelectAll().AsQueryable();

            if (empId.HasValue && empId.Value > 0)
            {
                query = query.Where(x => x.EmpId == empId.Value);
            }

            var list = query.OrderByDescending(x => x.EmpId)
                            .ThenByDescending(x => x.SeqNo)
                            .ToList();

            return await Task.FromResult(list.AsEnumerable());
        }

        public async Task<bool> AddOrUpdateSalaryRevision(TblEmployeeSalaryRevision tbl)
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
                    existing.Basic = tbl.Basic;
                    existing.Matrix = tbl.Matrix;
                    existing.FromDate = tbl.FromDate;
                    existing.ToDate = tbl.ToDate;
                    if (tbl.SeqNo > 0)
                    {
                        existing.SeqNo = tbl.SeqNo;
                    }
                    existing.IsActive = tbl.IsActive;
                    existing.UpdatedBy = tbl.UpdatedBy;
                    existing.UpdatedDate = DateTime.Now;

                    // If updated revision is set to active, deactivate/close any other active revisions for this employee
                    if (existing.IsActive)
                    {
                        var otherActive = repository.FindBy(x => x.EmpId == existing.EmpId && x.IsActive && x.Id != existing.Id).ToList();
                        foreach (var prev in otherActive)
                        {
                            prev.IsActive = false;
                            if (prev.ToDate == null)
                            {
                                prev.ToDate = existing.FromDate.AddDays(-1);
                            }
                            prev.UpdatedDate = DateTime.Now;
                            await Update(prev);
                        }
                    }

                    await Update(existing);
                    tbl.CreatedDate = existing.CreatedDate;
                    tbl.CreatedBy = existing.CreatedBy;
                    tbl.UpdatedDate = existing.UpdatedDate;
                    return true;
                }
                else
                {
                    // Auto-calculate sequence number if not specified
                    if (tbl.SeqNo <= 0)
                    {
                        var empRevisions = repository.FindBy(x => x.EmpId == tbl.EmpId).ToList();
                        tbl.SeqNo = empRevisions.Any() ? empRevisions.Max(x => x.SeqNo) + 1 : 1;
                    }

                    tbl.CreatedDate = DateTime.Now;

                    // If new revision is active, deactivate/close previous active revision
                    if (tbl.IsActive)
                    {
                        var previousActive = repository.FindBy(x => x.EmpId == tbl.EmpId && x.IsActive).ToList();
                        foreach (var prev in previousActive)
                        {
                            prev.IsActive = false;
                            if (prev.ToDate == null)
                            {
                                prev.ToDate = tbl.FromDate.AddDays(-1);
                            }
                            prev.UpdatedDate = DateTime.Now;
                            await Update(prev);
                        }
                    }

                    await Create(tbl);
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<IEnumerable<spa_getemployeesalaryrevision_records_Result>> GetSalaryRevisionRecords(int? employeeId = null, string search = null)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<spa_getemployeesalaryrevision_records_Result>(
                    "exec dbo.spa_getemployeesalaryrevision_records @Employeeid, @search",
                    new SqlParameter("@Employeeid", (object)employeeId ?? DBNull.Value),
                    new SqlParameter("@search", (object)search ?? DBNull.Value)
                );
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<IEnumerable<spa_getemployeesalaryrevision_Result>> GetSalaryRevisionList(int? employeeId = null, int pageNumber = 1, int pageSize = 100, string search = null)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<spa_getemployeesalaryrevision_Result>(
                    "exec dbo.spa_getemployeesalaryrevision @Employeeid, @PageNumber, @PageSize, @search",
                    new SqlParameter("@Employeeid", (object)employeeId ?? DBNull.Value),
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

