using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
//using AvailAnalytics.Service.Common;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
using BusinessService.Common;
using Microsoft.Data.SqlClient;

namespace BusinessService.Custom.VendorAccountNumber
{
    public class VendorAccountNumberService : EntityService<TblVandorAccountNumber>, IVendorAccountNumberService
    {
        readonly IGenericStoredProcedureRepository<TblVandorAccountNumber> spRepository;
        readonly IGenericRepository<TblVandorAccountNumber> repository;
        readonly IUnitOfWork unitOfWork;



        public VendorAccountNumberService(IUnitOfWork _unitOfWork, IGenericRepository<TblVandorAccountNumber> _repository, IGenericStoredProcedureRepository<TblVandorAccountNumber> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblVandorAccountNumber> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblVandorAccountNumber Vacc)
        {
            try
            {
                await Create(Vacc);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<int> tblupdate(TblVandorAccountNumber Vacc)
        {
            try
            {
                await Update(Vacc);
                return Vacc.Id;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public async Task<IEnumerable<GetVendorAccountNumberByVendorID_Result>> GetVendorAccountNumberByVendorID(int venderID)
        {
            SqlParameter Id = new SqlParameter("@VenderID", venderID);
            return await spRepository.ExecWithStoreProcedureAsync<GetVendorAccountNumberByVendorID_Result>("exec GetVendorAccountNumberByVendorID @VenderID", Id);
        }

    }
}
