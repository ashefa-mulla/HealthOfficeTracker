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

namespace BusinessService.Custom.Employer_FirstLevel_Detail
{
    public class EmployerFirstLevelDetailService : EntityService<TblEmployerFirstLevelDetails>, IEmployerFirstLevelDetailService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEmployerFirstLevelDetails> spRepository;
        private readonly GenericRepository<TblEmployerFirstLevelDetails> genericRepository;
        readonly IGenericRepository<TblEmployerFirstLevelDetails> repository;


        public EmployerFirstLevelDetailService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployerFirstLevelDetails> _repository,
            IGenericStoredProcedureRepository<TblEmployerFirstLevelDetails> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployerFirstLevelDetails> Get(int ID)
        {
            //return await unitOfWork.ctx.TblEmployerFirstLevelDetails.Where(o => o.Id == ID).Include(o => o.TblAttorneyContactdtl).FirstOrDefaultAsync();
            return await repository.SelectById(ID);
        }

        public async Task<TblEmployerFirstLevelDetails> GetRecruitInterviewDetailbyId(int ID, string ColumnName)
        {
            return await unitOfWork.ctx.TblEmployerFirstLevelDetails.Where(o => o.InterviewId == ID).Where(o => o.ColumnName == ColumnName)
                .FirstOrDefaultAsync();
            //return await repository.SelectById(ID);
        }
        public async Task<bool> tblinsert(TblEmployerFirstLevelDetails tbl)
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

        public async Task<bool> tblupdate(TblEmployerFirstLevelDetails tbl)
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
        
    }
}
