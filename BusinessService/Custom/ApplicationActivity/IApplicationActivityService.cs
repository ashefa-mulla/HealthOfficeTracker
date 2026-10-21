using BusinessData.DataContext;
using BusinessService.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.ApplicationActivity
{
    public interface IApplicationActivityService : IEntityService<TblApplicationActivity>
    {
        Task<TblApplicationActivity> Get(Guid activityId, Guid deviceId);
        Task<bool> Updatetbl(TblApplicationActivity tbl);
        Task<bool> Inserttbl(TblApplicationActivity tbl);
        Task<bool> Deletetbl(Guid activityId, Guid deviceId);
    }
}
