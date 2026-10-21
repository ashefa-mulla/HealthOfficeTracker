using BusinessData.DataContext;
using BusinessService.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.IdleActivity
{
    public interface IIdleActivityService : IEntityService<TblIdleActivity>
    {
        Task<TblIdleActivity?> Get(Guid activityId, Guid deviceId);
        Task<bool> Inserttbl(TblIdleActivity tbl);
        Task<bool> Updatetbl(TblIdleActivity tbl);
        Task<bool> Deletetbl(Guid activityId, Guid deviceId);
    }
}
