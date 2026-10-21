using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.Agent
{
    public interface IDeviceService : IEntityService<TblDevice>
    {
        Task<TblDevice> Get(Guid deviceId);
        Task<bool> Updatetbl(TblDevice tbl);
        Task<bool> Inserttbl(TblDevice tbl);
        Task<bool> Deletetbl(Guid deviceId);
        Task<IEnumerable<sp_employee_clockedin>> GetClockedIn(int empid);

    }
}
