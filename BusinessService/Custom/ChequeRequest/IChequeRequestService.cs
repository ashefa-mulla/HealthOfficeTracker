using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.ChequeRequest
{
    public interface IChequeRequestService : IEntityService<TblChequeRequest>
    {
        Task<TblChequeRequest> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblChequeRequest tbl);
        Task<bool> tblupdate(TblChequeRequest tbl);
        Task<IEnumerable<GetAllChequeRequest_Result>> GetAllChequeRequest();        
    }
}
