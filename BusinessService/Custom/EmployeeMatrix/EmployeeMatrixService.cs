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

namespace BusinessService.Custom.EmployeeMatrix
{
    public class EmployeeMatrixService : EntityService<TblEmployeeMatrix>, IEmployeeMatrixService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEmployeeMatrix> spRepository;
        private readonly GenericRepository<TblEmployeeMatrix> genericRepository;
        readonly IGenericRepository<TblEmployeeMatrix> repository;


        public EmployeeMatrixService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployeeMatrix> _repository,
            IGenericStoredProcedureRepository<TblEmployeeMatrix> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployeeMatrix> Get(int ID)
        {
            //return await unitOfWork.ctx.TblEmployeeMatrix.Where(o => o.Id == ID).Include(o => o.TblAttorneyContactdtl).FirstOrDefaultAsync();
            return await repository.SelectById(ID);
        }
        public async Task<TblEmployeeMatrix> GetRecruitbyId(int ID)
        {
            return await unitOfWork.ctx.TblEmployeeMatrix.Where(o => o.EmployeeId == ID)
                .FirstOrDefaultAsync();
            //return await repository.SelectById(ID);
        }
        public async Task<bool> tblinsert(TblEmployeeMatrix tbl)
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

        public async Task<bool> tblupdate(TblEmployeeMatrix tbl)
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
        public async Task<IEnumerable<sp_getdailyemployeematrixlist>> DailyMatrixlist(int employerid,DateTime evaluationdate )
        {

          
            SqlParameter EId = new SqlParameter("@EID", employerid);
            SqlParameter EDate = new SqlParameter("@Edate", evaluationdate);

            return await spRepository.ExecWithStoreProcedureAsync<sp_getdailyemployeematrixlist>("exec sp_getdailyemployeematrixlist @EID,@Edate",  EId,EDate);
        }
        public async Task<IEnumerable<sp_getEmployeematrix>> GetEmployeematrix(int employerid)
        {


            SqlParameter EId = new SqlParameter("@EID", employerid);

            return await spRepository.ExecWithStoreProcedureAsync<sp_getEmployeematrix>("exec sp_getEmployeematrix @EID", EId);
        }
        public async Task<IEnumerable<sp_getemployeematrixlist>> GetMatrixlist(int employerid, DateTime fdate, DateTime tdate)
        {


            SqlParameter EId = new SqlParameter("@EID", employerid);
            SqlParameter FDate = new SqlParameter("@Fdate", fdate);
            SqlParameter TDate = new SqlParameter("@Tdate", tdate);
            return await spRepository.ExecWithStoreProcedureAsync<sp_getemployeematrixlist>("exec sp_getemployeematrixlist @EID,@Fdate,@Tdate", EId, FDate,TDate);
        }
        public async Task<IEnumerable<sp_getemployeematrixsummaryreport>> GetMatrixsummarylist(int month, int year)
        {


            SqlParameter Month = new SqlParameter("@month", month);
            SqlParameter Year = new SqlParameter("@year", year);
            
            return await spRepository.ExecWithStoreProcedureAsync<sp_getemployeematrixsummaryreport>("exec sp_getemployeematrixsummaryreport @month,@year", Month, Year);
        }

    }
}
