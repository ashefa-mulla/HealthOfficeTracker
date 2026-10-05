using BusinessData.DataContext;
using BusinessData.Pagination;
using BusinessService.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Custom.Employer_Form
{
    public interface IEmployerFormService : IEntityService<TblEmployerForms>
    {
        Task<TblEmployerForms> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblEmployerForms tbl);
        Task<bool> tblupdate(TblEmployerForms tbl);
        Task<IEnumerable<TblEmployerForms>> Getbyemployerid(int ID);
        Task<IEnumerable<sp_updateemployerform>> UpdateActivetag(int id,int employerid,string action);
        Task<TblEmployerForms> Getbyactiveemployerform(int Eid);
    }
}
