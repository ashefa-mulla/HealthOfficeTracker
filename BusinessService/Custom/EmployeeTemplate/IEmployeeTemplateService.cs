using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Custom.EmployeeTemplate
{
    public interface IEmployeeTemplateService : IEntityService<TblEmployeeTemplate>
    {
        Task<TblEmployeeTemplate> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblEmployeeTemplate tbl);
        Task<bool> tblupdate(TblEmployeeTemplate tbl);
        Task<IEnumerable<TblEmployeeTemplate>> Getbyemployerid(int ID);
        Task<IEnumerable<sp_updateemployerform>> UpdateActivetag(int id,int employerid,string action);
        Task<TblEmployeeTemplate> Getbyactiveemployeetemplate(int Eid);

        Task<IEnumerable<sp_getusermatrix>> Getbyusermatrixbyeid(int EID);
    }
}
