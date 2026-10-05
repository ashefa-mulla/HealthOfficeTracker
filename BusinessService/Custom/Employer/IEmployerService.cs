using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace BusinessService.Custom.Employer
{
   public interface IEmployerService : IEntityService<TblEmployer>
    {
        Task<TblEmployer> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblEmployer tbl);
        Task<bool> tblupdate(TblEmployer tbl);
        Task<IEnumerable<sp_getemployerlist>> GetEmployer( int pageNumber, int pageSize, string search);

        Task<IEnumerable<sp_getemployerlistcount>> GetEmployerRecords( string search);

      


        Task<PageList<sp_getemployerlist>> GetEmployerbyPageAsync(int Cnt, int pageNumber, int pageSize, string search);
        Task<IEnumerable<TblEmployer>> Getbyemployerlist();
    }
}
