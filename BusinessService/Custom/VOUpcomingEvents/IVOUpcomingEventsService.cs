using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.VOUpcomingEvents
{
    public interface IVOUpcomingEventsService : IEntityService<TblVoupcomingEvents>
    {
        Task<TblVoupcomingEvents> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblVoupcomingEvents tbl);
        Task<bool> tblupdate(TblVoupcomingEvents tbl);
        Task<IEnumerable<GetVOUpcomingEvents_Result>> GetVOUpcomingEvents();        

    }
}
