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
    public interface ICommonService : IEntityService<TblCountry>
    {
        Task<IEnumerable<GetCountries_Result>> GetCountries();
        Task<IEnumerable<GetStates_Result>> GetStates(int coutnryID);
        Task<IEnumerable<GetCities_Result>> GetCities(int stateID);
        Task<TblCity> GetCityIdFromName(string CityName);
        Task<TblCountry> GetCountryIdFromName(string CountryName);
        Task<TblState> GetStateIdFromName(string StateName, int CountryID);
        Task<IEnumerable<TblTimezone>> GetTimeZoneList();
        Task<IEnumerable<GetDesignation_Result>> GetDesignation();
        Task<IEnumerable<GetCompanyBranchListByCompanyID_Result>> GetCompanyBranchListByCompanyID(int CID);
        Task<IEnumerable<TblUserType>> GetUserTypes();
        Task<IEnumerable<sp_getmonth>> GetMonts();
        Task<IEnumerable<sp_getyear>> GetYears();

    }
}
