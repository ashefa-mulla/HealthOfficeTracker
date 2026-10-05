using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Custom.Employer_FirstLevel_Detail
{
    public interface IEmployerFirstLevelDetailService : IEntityService<TblEmployerFirstLevelDetails>
    {
        Task<TblEmployerFirstLevelDetails> Get(int ID);
        Task<TblEmployerFirstLevelDetails> GetRecruitInterviewDetailbyId(int ID, string ColumnName);

        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblEmployerFirstLevelDetails tbl);
        Task<bool> tblupdate(TblEmployerFirstLevelDetails tbl);

    }
}
