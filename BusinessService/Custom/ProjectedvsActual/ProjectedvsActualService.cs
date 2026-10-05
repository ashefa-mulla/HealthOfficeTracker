using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.ProjectedvsActual
{
    public class ProjectedvsActualService : EntityService<TblProjectedvsActual>, IProjectedvsActualService
    {
        readonly IGenericStoredProcedureRepository<TblProjectedvsActual> spRepository;
        readonly IGenericRepository<TblProjectedvsActual> repository;
        readonly IUnitOfWork unitOfWork;



        public ProjectedvsActualService(IUnitOfWork _unitOfWork, IGenericRepository<TblProjectedvsActual> _repository, IGenericStoredProcedureRepository<TblProjectedvsActual> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblProjectedvsActual> Get(int ID)
        {

            return await repository.SelectById(ID);
        }
        public async Task<bool> tblinsert(TblProjectedvsActual tbl)
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

        public async Task<bool> tblupdate(TblProjectedvsActual tbl)
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

        public async Task<IEnumerable<UpdateTrackerSummarybyMonth_ProjectedvsActual_Result>> UpdateActualIncome(string month, string year)
        {
            return await spRepository.ExecWithStoreProcedureAsync<UpdateTrackerSummarybyMonth_ProjectedvsActual_Result>("exec UpdateTrackerSummarybyMonth_ProjectedvsActual @month,@year", new SqlParameter("@month", month), new SqlParameter("@year", year));
        }

    }
}
