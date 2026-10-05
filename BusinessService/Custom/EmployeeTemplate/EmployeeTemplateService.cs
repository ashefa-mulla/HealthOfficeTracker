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
namespace BusinessService.Custom.EmployeeTemplate
{
   public  class EmployeeTemplateService : EntityService<TblEmployeeTemplate>, IEmployeeTemplateService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEmployeeTemplate> spRepository;
        private readonly GenericRepository<TblEmployeeTemplate> genericRepository;
        readonly IGenericRepository<TblEmployeeTemplate> repository;


        public EmployeeTemplateService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployeeTemplate> _repository,
            IGenericStoredProcedureRepository<TblEmployeeTemplate> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployeeTemplate> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblEmployeeTemplate tbl)
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

        public async Task<bool> tblupdate(TblEmployeeTemplate tbl)
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

        public async Task<IEnumerable<TblEmployeeTemplate>> Getbyemployerid(int id)
        {
            return await unitOfWork.ctx.TblEmployeeTemplate.Where(x => x.EmployeeId == id).ToListAsync();
        }
        public async Task<IEnumerable<sp_updateemployerform>> UpdateActivetag(int id, int employerid, string action)
        {

            SqlParameter Id = new SqlParameter("@ID", id);
            SqlParameter EId = new SqlParameter("@EID", employerid);
            SqlParameter Action = new SqlParameter("@Action", action);
            return await spRepository.ExecWithStoreProcedureAsync<sp_updateemployerform>("exec sp_updateemployerform @ID,@EID,@Action", Id,EId,Action);
        }
        public async Task<TblEmployeeTemplate> Getbyactiveemployeetemplate(int Eid)
        {
            return await unitOfWork.ctx.TblEmployeeTemplate.Where(x => x.EmployeeId == Eid).Where(x=>x.Active==true).FirstAsync();
        }
        public async Task<IEnumerable<sp_getusermatrix>> Getbyusermatrixbyeid(int EID)
        {

         
            SqlParameter EId = new SqlParameter("@EID", EID);
           
            return await spRepository.ExecWithStoreProcedureAsync<sp_getusermatrix>("exec sp_getusermatrix @EID", EId);
        }
    }
}
