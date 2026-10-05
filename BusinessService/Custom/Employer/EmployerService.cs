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
namespace BusinessService.Custom.Employer
{
    public class EmployerService : EntityService<TblEmployer>, IEmployerService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEmployer> spRepository;
        private readonly GenericRepository<TblEmployer> genericRepository;
        readonly IGenericRepository<TblEmployer> repository;


        public EmployerService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployer> _repository,
            IGenericStoredProcedureRepository<TblEmployer> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployer> Get(int ID)
        {
           
            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblEmployer tbl)
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

        public async Task<bool> tblupdate(TblEmployer tbl)
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
        public async Task<IEnumerable<sp_getemployerlist>> GetEmployer(int pageNumber, int pageSize, string search)
        {
          
            SqlParameter pagenumber = new SqlParameter("@pagenumber", pageNumber);
            SqlParameter pagesize = new SqlParameter("@pagesize", pageSize);
            SqlParameter Search = new SqlParameter("@search", search);

            return await spRepository.ExecWithStoreProcedureAsync<sp_getemployerlist>("exec sp_getemployerlist @pagenumber, " +
                "@pagesize, @search",  pagenumber, pagesize, Search);

        }
        public async Task<IEnumerable<sp_getemployerlistcount>> GetEmployerRecords(string search)
        {

            SqlParameter Search = new SqlParameter("@search", search);
            return await spRepository.ExecWithStoreProcedureAsync<sp_getemployerlistcount>("exec sp_getemployerlistcount  @search",Search);
        }
        public async Task<PageList<sp_getemployerlist>> GetEmployerbyPageAsync(int Cnt,  int pageNumber, int pageSize, string search)
        {
            PageList<sp_getemployerlist> EmployerbyPages = new PageList<sp_getemployerlist>(Cnt, pageNumber, pageSize);
            var org = await GetEmployer( pageNumber, pageSize, search);
            EmployerbyPages.AddRange(org);
            return EmployerbyPages;
        }
        public async Task<IEnumerable<TblEmployer>> Getbyemployerlist()
        {
            return await unitOfWork.ctx.TblEmployer.Where(x => x.Active == true)
               .OrderBy(x=>x.Firstname)
                .ToListAsync();
        }
    }
}
