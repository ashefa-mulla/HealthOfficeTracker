using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.AllowanceMaster
{
    public enum AllowanceSaveStatus
    {
        Saved,
        Invalid,
        DuplicateCode,
        NotFound,
        Failed
    }

    public interface IAllowanceMasterService : IEntityService<TblAllowanceMaster>
    {
        /// <summary>All allowances; pass isActive = null for every row.</summary>
        Task<IEnumerable<TblAllowanceMaster>> GetAllowanceMasterList(bool? isActive = true);

        /// <summary>Single allowance by primary key, or null.</summary>
        Task<TblAllowanceMaster> GetAllowanceMaster(long id);

        /// <summary>True if another row (active or not) already uses this code.</summary>
        Task<bool> IsAllowanceCodeTaken(string allowanceCode, long excludeId = 0);

        /// <summary>Insert when entity.Id == 0, otherwise update. Applies the fixed defaults on insert.</summary>
        Task<(AllowanceSaveStatus Status, long Id)> SaveAllowanceMaster(TblAllowanceMaster entity, int userId);

        /// <summary>Soft delete: sets IsActive = false.</summary>
        Task<bool> DeActivateAllowanceMaster(long id, int userId);
    }
}
