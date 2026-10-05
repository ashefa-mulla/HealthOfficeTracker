using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.PurchaseOrderReferenceDocument
{
    public interface IPurchaseOrderReferenceDocumentService : IEntityService<TblPoReferanceDocument>
    {
        Task<TblPoReferanceDocument> Get(int ID);        
        Task<bool> tblinsert(TblPoReferanceDocument tbl);
        Task<bool> tblupdate(TblPoReferanceDocument tbl);
        Task<bool> tbldelete(int id);
        Task<IEnumerable<GetPurchaseOrderRefDocList_Result>> GetPurchaseOrderRefDocList(int PID);
    }
}
