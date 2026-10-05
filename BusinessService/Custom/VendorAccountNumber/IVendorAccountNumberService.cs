using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.VendorAccountNumber
{
    public interface IVendorAccountNumberService : IEntityService<TblVandorAccountNumber>
    {
        Task<TblVandorAccountNumber> Get(int ID);
        Task<bool> tblinsert(TblVandorAccountNumber Vacc);

        Task<int> tblupdate(TblVandorAccountNumber Vacc);

        Task<IEnumerable<GetVendorAccountNumberByVendorID_Result>> GetVendorAccountNumberByVendorID(int venderID);

    }
}
