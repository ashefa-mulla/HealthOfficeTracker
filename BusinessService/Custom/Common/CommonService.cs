using System;
using System.Collections.Generic;
using System.Text;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
using BusinessService.Common;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using BusinessData.Pagination;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BusinessService.Custom.Common
{
    public class CommonService : EntityService<TblCountry>, ICommonService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblCountry> spRepository;
        private readonly GenericRepository<TblCountry> genericRepository;
        readonly IGenericRepository<TblCountry> repository;

        public CommonService(IUnitOfWork _unitOfWork, IGenericRepository<TblCountry> _repository,
            IGenericStoredProcedureRepository<TblCountry> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }


        public async Task<IEnumerable<GetCountries_Result>> GetCountries()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetCountries_Result>("exec GetCountries");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }



        public async Task<IEnumerable<GetStates_Result>> GetStates(int coutnryID)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetStates_Result>("exec GetStates @pCOUNTRYID", new SqlParameter("@pCOUNTRYID", coutnryID));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<GetCities_Result>> GetCities(int stateID)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetCities_Result>("exec GetCities @pSTATE", new SqlParameter("@pSTATE", stateID));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<TblTimezone>> GetTimeZoneList()
        {
            return await unitOfWork.ctx.TblTimezones.OrderBy(m => m.Id).ToListAsync();
        }

        public async Task<TblCity> GetCityIdFromName(string CityName)
        {
            return await Task.Run(() => unitOfWork.ctx.TblCities.FirstOrDefault(h => h.Name.ToLower() == CityName.ToLower())); 
        }

        public async Task<TblCountry> GetCountryIdFromName(string CountryName)
        {
            return await Task.Run(() => unitOfWork.ctx.TblCountries.FirstOrDefault(h => h.CountryCode.ToLower() == CountryName.ToLower()));
        }
        public async Task<TblState> GetStateIdFromName(string StateName, int CountryID)
        {
            return await Task.Run(() => unitOfWork.ctx.TblStates.FirstOrDefault(h => h.Code.ToLower() == StateName.ToLower() && h.CountryId == CountryID));
        }

        public async Task<IEnumerable<GetDesignation_Result>> GetDesignation()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetDesignation_Result>("exec GetDesignation");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<GetCompanyBranchListByCompanyID_Result>> GetCompanyBranchListByCompanyID(int CID)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetCompanyBranchListByCompanyID_Result>("exec GetCompanyBranchListByCompanyID @CID", new SqlParameter("@CID", CID));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<TblUserType>> GetUserTypes()
        {
            return await unitOfWork.ctx.TblUserTypes.ToListAsync();
        }

        public async Task<IEnumerable<sp_getmonth>> GetMonts()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_getmonth>("exec sp_getmonth");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<sp_getyear>> GetYears()
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_getyear>("exec sp_getyear");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
