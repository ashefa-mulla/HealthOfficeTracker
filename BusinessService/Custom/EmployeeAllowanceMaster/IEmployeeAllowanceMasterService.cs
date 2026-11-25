using BusinessData.DataContext;
using BusinessService.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.EmployeeAllowanceMaster
{
    public interface IEmployeeAllowanceMasterService : IEntityService<TblAllowanceMaster>
    {
        Task<TblAllowanceMaster> Get(long id);

        Task<IEnumerable<TblAllowanceMaster>> GetAll(bool? isActive = null);

        Task<bool> tblinsert(TblAllowanceMaster tbl);

        Task<bool> tblupdate(TblAllowanceMaster tbl);

        Task<bool> tbldelete(long id);

        Task<bool> IsCodeTaken(string code, long excludeId = 0);

        Task<bool> DeActivateAllowanceMaster(long id);
    }
}
