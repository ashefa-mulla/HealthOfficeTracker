using BusinessData.DataContext;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Custom.User
{
    public interface IUserService : IEntityService<TblUserMaster>
    {
        Task<TblUserMaster> Get(int id);
        Task<bool> Tbl_Delete(int id);
        Task<int> Tbl_Insert(TblUserMaster tbl);
        Task<bool> Tbl_Update(TblUserMaster tbl);
        Task<IEnumerable<GetUserId>> GetUserId(string id);
        


    }
}