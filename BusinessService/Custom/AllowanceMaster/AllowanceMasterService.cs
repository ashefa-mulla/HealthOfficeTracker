using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Custom.AllowanceMaster
{
    public class AllowanceMasterService : EntityService<TblAllowanceMaster>, IAllowanceMasterService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepository<TblAllowanceMaster> repository;

        public AllowanceMasterService(
            IUnitOfWork _unitOfWork,
            IGenericRepository<TblAllowanceMaster> _repository,
            IGenericStoredProcedureRepository<TblAllowanceMaster> _spRepository = null)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
        }

        public async Task<IEnumerable<TblAllowanceMaster>> GetAllowanceMasterList(bool? isActive = true)
        {
            var query = unitOfWork.ctx.TblAllowanceMasters.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            return await query
                .OrderBy(x => x.AllowanceName)
                .ToListAsync();
        }

        public async Task<TblAllowanceMaster> GetAllowanceMaster(long id)
        {
            return await unitOfWork.ctx.TblAllowanceMasters
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> IsAllowanceCodeTaken(string allowanceCode, long excludeId = 0)
        {
            var code = (allowanceCode ?? string.Empty).Trim();

            // Includes inactive rows because the unique index on AllowanceCode is not filtered by IsActive.
            return await unitOfWork.ctx.TblAllowanceMasters
                .AnyAsync(x => x.AllowanceCode == code && x.Id != excludeId);
        }

        public async Task<(AllowanceSaveStatus Status, long Id)> SaveAllowanceMaster(TblAllowanceMaster entity, int userId)
        {
            if (entity == null)
            {
                return (AllowanceSaveStatus.Invalid, 0);
            }

            entity.AllowanceName = (entity.AllowanceName ?? string.Empty).Trim();
            entity.AllowanceCode = (entity.AllowanceCode ?? string.Empty).Trim();
            entity.AllowanceType = (entity.AllowanceType ?? string.Empty).Trim().ToUpperInvariant();

            if (entity.AllowanceName.Length == 0 || entity.AllowanceCode.Length == 0)
            {
                return (AllowanceSaveStatus.Invalid, 0);
            }

            // E = Earnings (taxable), D = Deduction (not taxable)
            if (entity.AllowanceType != "E" && entity.AllowanceType != "D")
            {
                return (AllowanceSaveStatus.Invalid, 0);
            }

            if (await IsAllowanceCodeTaken(entity.AllowanceCode, entity.Id))
            {
                return (AllowanceSaveStatus.DuplicateCode, 0);
            }

            try
            {
                var isTaxable = entity.AllowanceType == "E";
                var now = DateTime.Now;

                if (entity.Id == 0)
                {
                    // Fixed defaults for a new allowance master row
                    entity.IsMonthlyAllowance = true;
                    entity.IsFixed = true;
                    entity.IsLopapplicable = false;
                    entity.IsTaxable = isTaxable;
                    entity.IsActive = true;
                    entity.CalculationType = string.IsNullOrWhiteSpace(entity.CalculationType) ? "Fixed" : entity.CalculationType;
                    entity.CreatedBy = userId;
                    entity.CreatedDate = now;
                    entity.UpdatedBy = null;
                    entity.UpdatedDate = null;

                    await Create(entity);
                    return (AllowanceSaveStatus.Saved, entity.Id);
                }

                var existing = await repository.SelectById(entity.Id);
                if (existing == null || !existing.IsActive)
                {
                    return (AllowanceSaveStatus.NotFound, 0);
                }

                // Only the editable fields change; the defaults set at insert stay as they are.
                existing.AllowanceName = entity.AllowanceName;
                existing.AllowanceCode = entity.AllowanceCode;
                existing.AllowanceType = entity.AllowanceType;
                existing.IsTaxable = isTaxable;
                existing.UpdatedBy = userId;
                existing.UpdatedDate = now;

                await Update(existing);
                return (AllowanceSaveStatus.Saved, existing.Id);
            }
            catch (Exception)
            {
                return (AllowanceSaveStatus.Failed, 0);
            }
        }

        public async Task<bool> DeActivateAllowanceMaster(long id, int userId)
        {
            try
            {
                var existing = await repository.SelectById(id);
                if (existing == null)
                {
                    return false;
                }

                existing.IsActive = false;
                existing.UpdatedBy = userId;
                existing.UpdatedDate = DateTime.Now;

                await Update(existing);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
