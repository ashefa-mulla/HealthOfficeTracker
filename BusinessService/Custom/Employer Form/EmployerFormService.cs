using System;
using System.Collections.Generic;
using System.Text;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
using BusinessService.Common;
using System.Threading.Tasks;
using System.Data.SqlClient;
using BusinessData.Pagination;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace BusinessService.Custom.Employer_Form
{
   public  class EmployerFormService : EntityService<TblEmployerForms>, IEmployerFormService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEmployerForms> spRepository;
        private readonly GenericRepository<TblEmployerForms> genericRepository;
        readonly IGenericRepository<TblEmployerForms> repository;


        public EmployerFormService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployerForms> _repository,
            IGenericStoredProcedureRepository<TblEmployerForms> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployerForms> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblEmployerForms tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> tblupdate(TblEmployerForms tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> tbldelete(int id)
        {
            try
            {
                await Delete(await Get(id));
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<IEnumerable<TblEmployerForms>> Getbyemployerid(int id)
        {
            return await unitOfWork.ctx.TblEmployerForms.Where(x => x.EmployeeId == id).ToListAsync();
        }
        public async Task<IEnumerable<sp_updateemployerform>> UpdateActivetag(int id, int employerid, string action)
        {

            SqlParameter Id = new SqlParameter("@ID", id);
            SqlParameter EId = new SqlParameter("@EID", employerid);
            SqlParameter Action = new SqlParameter("@Action", action);
            return await spRepository.ExecWithStoreProcedureAsync<sp_updateemployerform>("exec sp_updateemployerform @ID,@EID,@Action", Id,EId,Action);
        }
        public async Task<TblEmployerForms> Getbyactiveemployerform(int Eid)
        {
            return await unitOfWork.ctx.TblEmployerForms.Where(x => x.EmployeeId == Eid).Where(x=>x.Active==true).FirstAsync();
        }
    }
}
