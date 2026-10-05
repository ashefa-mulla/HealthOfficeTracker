using System;
using System.Linq;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Custom.EvaluationLock
{
    public class EvaluationLockService : EntityService<TblEvaluationLock>, IEvaluationLockService
    {
        readonly IGenericRepository<TblEvaluationLock> repository;
        readonly IUnitOfWork unitOfWork;

        public EvaluationLockService(IUnitOfWork _unitOfWork, IGenericRepository<TblEvaluationLock> _repository)
            : base(_unitOfWork, _repository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
        }

        public async Task<TblEvaluationLock> Get(int id)
        {
            return await repository.SelectById(id);
        }

        public async Task<TblEvaluationLock> GetByEmployeeYearMonth(int employeeId, int evalYear, int evalMonth)
        {
            return await Task.Run(() => unitOfWork.ctx.TblEvaluationLocks
                .Where(l => l.EmployeeId == employeeId && l.EvalYear == evalYear && l.EvalMonth == evalMonth)
                .FirstOrDefault());
        }



        public async Task<bool> tblinsert(TblEvaluationLock tbl)
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

        public async Task<bool> tblupdate(TblEvaluationLock tbl)
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

        public async Task<bool> IsLocked(int employeeId, int evalYear, int evalMonth)
        {
            var lockRecord = await GetByEmployeeYearMonth(employeeId, evalYear, evalMonth);
            return lockRecord != null && lockRecord.IsLocked;
        }
    }
}
