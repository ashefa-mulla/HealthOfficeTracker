using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.SyncLog
{
    public interface ISyncLogService : IEntityService<TblSyncLog>
    {
        Task<TblSyncLog> Get(Guid deviceId);
        Task<bool> Updatetbl(TblSyncLog tbl);
        Task<bool> Inserttbl(TblSyncLog tbl);
        Task<bool> Deletetbl(Guid deviceId);

    }
}
