using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.VendorAccount
{
    public interface IVendorAccountService : IEntityService<TblVandorAccount>
    {
        Task<TblVandorAccount> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<int> tblinsert(TblVandorAccount tbl);
        Task<bool> tblupdate(TblVandorAccount tbl);
        Task<bool> DeActivateVendorAccount(int id);
        Task<IEnumerable<GetAllVandorAccount_Result>> GetAllVendorAccount();
        Task<IEnumerable<GetAllVandorAccount_Result>> GetVendorAccountByCategoryID(int categoryid);

    }
}
