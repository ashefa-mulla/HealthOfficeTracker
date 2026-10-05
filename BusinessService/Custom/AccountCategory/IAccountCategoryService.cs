using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.AccountCategory
{
    public interface IAccountCategoryService : IEntityService<TblAccountCategory>
    {
        Task<TblAccountCategory> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblAccountCategory tbl);
        Task<bool> tblupdate(TblAccountCategory tbl);

        Task<IEnumerable<GetAllAccountCategory_Result>> GetAllAccountCategory();

        //IEnumerable<GetOrderTypeList_Result> GetOrderTypeList(int CID);

        //IEnumerable<GetPurchaseOrderReport_Result> GetPurchaseOrderReport(int PID);

        Task<bool> DeActivateAccountCategory(int id);

    }
}
