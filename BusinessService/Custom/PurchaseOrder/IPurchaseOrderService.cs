using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.PurchaseOrder
{
    public interface IPurchaseOrderService : IEntityService<TblPodetail>
    {
        //Task<TblPodetail> Get(int ID);
        Task<TblPodetail?> Get(int ID);


        Task<int> tblinsert(TblPodetail tbl);

        Task<bool> tblupdate(TblPodetail tbl);

        Task<bool> tbldelete(int id);

        Task<IEnumerable<GetPurchaseOrderList_Result>> GetPurchaseOrderList(int compnayid);
        Task<IEnumerable<GetPurchaseOrderListbyFilter_Result>> GetPurchaseOrderListbyFilter(int Comp_ID, int active);
        Task<IEnumerable<GetPurchaseOrderReport_Result>> GetPurchaseOrderReport(int PID);        
        Task<IEnumerable<GetAllCostCentre_Result>> GetAllCostCentre();
        Task<IEnumerable<GetPOPaymentDueDate_Result>> GetPOPaymentDueDate(int year, int month);
        Task<IEnumerable<POPaymentDueDateStmnt_Result>> POPaymentDueDateStmnt(int PID);
        Task<IEnumerable<GetPOPayBy_Result>> GetPOPayBy();
        Task<IEnumerable<GetSnailMail_Result>> GetSnailMail();
        Task<IEnumerable<sp_getpopaymentduedate>> GetPOPaymentDueDateCalender(int year, int month);
        Task<IEnumerable<sp_getpopaymentduedatenotification>> GetPOPaymentDueDateNotification();
    }
}
