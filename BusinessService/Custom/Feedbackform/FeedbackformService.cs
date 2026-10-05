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
namespace BusinessService.Custom.Feedbackform
{
    public class FeedbackformService : EntityService<TblMatrix4teamAnswer>, IFeedbackformService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblMatrix4teamAnswer> spRepository;
        private readonly GenericRepository<TblMatrix4teamAnswer> genericRepository;
        readonly IGenericRepository<TblMatrix4teamAnswer> repository;


        public FeedbackformService(IUnitOfWork _unitOfWork, IGenericRepository<TblMatrix4teamAnswer> _repository,
            IGenericStoredProcedureRepository<TblMatrix4teamAnswer> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }
        public async Task<TblMatrix4teamAnswer> Get(int ID)
        {
            //return await repository.SelectById(ID);
            return await Task.Run(() => unitOfWork.ctx.TblMatrix4teamAnswers.Where(o => o.Id == ID)
                       .FirstOrDefault());
        }

        public async Task<bool> tblInsert(TblMatrix4teamAnswer tbl)
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

        public async Task<bool> tblUpdate(TblMatrix4teamAnswer tbl)
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

        public async Task<bool> tblDelete(int id)
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

        //Feedback form 01-20 2025 GJ
        public async Task<IEnumerable<sp_get_userforfeedbackform_Results>> Getuserforfeedback()
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_get_userforfeedbackform_Results>("exec sp_get_userforfeedbackform");
        }


        public async Task<IEnumerable<sp_get_questionsforfeedbackform_Results>> Getquestionsforfeedback()
        {
            return await spRepository.ExecWithStoreProcedureAsync<sp_get_questionsforfeedbackform_Results>("exec sp_get_questionsforfeedbackform");
        }
    }
}
