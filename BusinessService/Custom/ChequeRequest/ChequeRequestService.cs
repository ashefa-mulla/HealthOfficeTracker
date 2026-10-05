using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
using BusinessService.Common;

namespace BusinessService.Custom.ChequeRequest
{
    public class ChequeRequestService : EntityService<TblChequeRequest>, IChequeRequestService
    {
        readonly IGenericStoredProcedureRepository<TblChequeRequest> spRepository;
        readonly IGenericRepository<TblChequeRequest> repository;
        readonly IUnitOfWork unitOfWork;



        public ChequeRequestService(IUnitOfWork _unitOfWork, IGenericRepository<TblChequeRequest> _repository, IGenericStoredProcedureRepository<TblChequeRequest> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }
        public async Task<TblChequeRequest> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblChequeRequest tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> tblupdate(TblChequeRequest tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception ex)
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
            catch (Exception ex)
            {
                return false;
            }

        }
        public async Task<IEnumerable<GetAllChequeRequest_Result>> GetAllChequeRequest()
        {            
            return await spRepository.ExecWithStoreProcedureAsync<GetAllChequeRequest_Result>("exec GetAllChequeRequest");
        }    
    }
}
