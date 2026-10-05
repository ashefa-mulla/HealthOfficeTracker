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

namespace BusinessService.Custom.PurchaseOrderReferenceDocument
{
    public class PurchaseOrderReferenceDocumentService : EntityService<TblPoReferanceDocument>, IPurchaseOrderReferenceDocumentService
    {
        readonly IGenericStoredProcedureRepository<TblPoReferanceDocument> spRepository;
        readonly IGenericRepository<TblPoReferanceDocument> repository;
        readonly IUnitOfWork unitOfWork;



        public PurchaseOrderReferenceDocumentService(IUnitOfWork _unitOfWork, IGenericRepository<TblPoReferanceDocument> _repository, IGenericStoredProcedureRepository<TblPoReferanceDocument> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblPoReferanceDocument> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblPoReferanceDocument tbl)
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

        public async Task<bool> tblupdate(TblPoReferanceDocument tbl)
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

        public async Task<IEnumerable<GetPurchaseOrderRefDocList_Result>> GetPurchaseOrderRefDocList(int PID)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetPurchaseOrderRefDocList_Result>("exec GetPurchaseOrderRefDocList @POID", new SqlParameter("@POID", PID));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
