using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.BankMaster
{
    public interface IBankMasterService : IEntityService<TblBankMaster>
    {
        Task<TblBankMaster> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblBankMaster tbl);
        Task<bool> tblupdate(TblBankMaster tbl);

        Task<IEnumerable<GetAllBankDetail_Result>> GetAllBankMaster();

        Task<IEnumerable<GetAllBankList_Result>> GetAllBankList();

        //IEnumerable<GetPurchaseOrderReport_Result> GetPurchaseOrderReport(int PID);

        Task<bool> DeActivateBankMaster(int id);

    }
}
