using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using BusinessService.Custom.EmployeeAttendance;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.EmployeeAllowanceMaster
{
         public class EmployeeAllowanceMasterService : EntityService<TblAllowanceMaster>, IEmployeeAllowanceMasterService
    {
        readonly IGenericStoredProcedureRepository<TblAllowanceMaster> spRepository;
        readonly IGenericRepository<TblAllowanceMaster> repository;
        readonly IUnitOfWork unitOfWork;

        public EmployeeAllowanceMasterService(IUnitOfWork _unitOfWork, IGenericRepository<TblAllowanceMaster> _repository, IGenericStoredProcedureRepository<TblAllowanceMaster> _spRepository = null)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }
        public async Task<TblAllowanceMaster> Get(long id)
        {
            return await unitOfWork.ctx.TblAllowanceMasters
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<TblAllowanceMaster>> GetAll(bool? isActive = null)
        {
            var query = unitOfWork.ctx.TblAllowanceMasters
                .AsNoTracking()
                .AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(
                    x => x.IsActive == isActive.Value);
            }

            return await query
                .OrderBy(x => x.AllowanceName)
                .ToListAsync();
        }

        public async Task<bool> tblinsert(TblAllowanceMaster tbl)
        {
            try
            {
                tbl.IsActive = true;
                tbl.IsMonthlyAllowance = true;
                tbl.IsLopapplicable = false;
                tbl.IsFixed = true;
                tbl.IsTaxable = tbl.AllowanceType == "E";
                tbl.CalculationType = "Fixed";
                tbl.CreatedDate = DateTime.Now;

                await Create(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> tblupdate(TblAllowanceMaster tbl)
        {
            try
            {
                var existing = await Get(tbl.Id);

                if (existing == null)
                    return false;

                existing.AllowanceName = tbl.AllowanceName;
                existing.AllowanceCode = tbl.AllowanceCode;
                existing.AllowanceType = tbl.AllowanceType;
                existing.Description = tbl.Description;

                existing.UpdatedBy = tbl.UpdatedBy;
                existing.UpdatedDate = DateTime.Now;

                await unitOfWork.ctx.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> tbldelete(long id)
        {
            return await DeActivateAllowanceMaster(id);
        }

        public async Task<bool> DeActivateAllowanceMaster(long id)
        {
            try
            {
                var existing = await Get(id);

                if (existing == null)
                    return false;

                existing.IsActive = false;
                existing.UpdatedDate = DateTime.Now;

                await unitOfWork.ctx.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> IsCodeTaken(
            string code,
            long excludeId = 0)
        {
            return await unitOfWork.ctx.TblAllowanceMasters
                .AnyAsync(x =>
                    x.AllowanceCode == code &&
                    x.Id != excludeId);
        }


    }
}
