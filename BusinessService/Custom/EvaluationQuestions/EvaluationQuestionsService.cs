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
using BusinessApp.Data;
namespace BusinessService.Custom.EvaluationQuestions
{
    public class EvaluationQuestionsService : EntityService<TblEvaluationQuestion>, IEvaluationQuestionsService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEvaluationQuestion> spRepository;
        private readonly GenericRepository<TblEvaluationQuestion> genericRepository;
        readonly IGenericRepository<TblEvaluationQuestion> repository;


        public EvaluationQuestionsService(IUnitOfWork _unitOfWork, IGenericRepository<TblEvaluationQuestion> _repository,
            IGenericStoredProcedureRepository<TblEvaluationQuestion> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }
        public async Task<TblEvaluationQuestion> Get(int ID)
        {
            return await repository.SelectById(ID);
            //return await Task.Run(() => unitOfWork.ctx.TblEvaluationQuestion.Where(o => o.Id == ID)
            //           .FirstOrDefault());
            //return await unitOfWork.ctx.TblEvaluationQuestion.FirstOrDefaultAsync(o => o.Id == ID);
        }

        public async Task<bool> tblInsert(TblEvaluationQuestion tbl)
        {
            try
            {
                tbl.CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
                await Create(tbl);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> tblUpdate(TblEvaluationQuestion tbl)
        {
            try
            {
                //tbl.CreatedAt = DateTime.UtcNow;  // update timestamp whenever record is modified
                tbl.CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
                await Update(tbl);
                return true;
            }
            catch
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

        //public async Task<IEnumerable<TblEvaluationQuestion>> tblGetAll()
        //{
        //    try
        //    {
        //        return await Task.Run(() =>
        //            unitOfWork.ctx.TblEvaluationQuestion
        //            .OrderByDescending(o => o.Id)
        //            .ToList()
        //        );
        //    }
        //    catch
        //    {
        //        return new List<TblEvaluationQuestion>();
        //    }
        //}
        public async Task<IEnumerable<TblEvaluationQuestion>> tblGetAll()
        {
            try
            {
                return await unitOfWork.ctx.TblEvaluationQuestions
                    .OrderByDescending(o => o.Id)
                    .ToListAsync();
            }
            catch
            {
                return new List<TblEvaluationQuestion>();
            }
        }

        //public async Task<bool> ToggleEvaluationQuestionStatus(int id)
        //{
        //    try
        //    {
        //        var question = await Task.Run(() =>
        //            unitOfWork.ctx.TblEvaluationQuestion.FirstOrDefault(q => q.Id == id)
        //        );

        //        if (question == null)
        //            return false;

        //        // Safely toggle nullables
        //        question.IsActive = !(question.IsActive ?? false);
        //        question.CreatedAt = DateTime.UtcNow; // optional

        //        await Task.Run(() =>
        //        {
        //            unitOfWork.ctx.TblEvaluationQuestion.Update(question);
        //            unitOfWork.ctx.SaveChanges();
        //        });

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("Error toggling question: " + ex.Message);
        //        return false;
        //    }
        //}

        public async Task<bool> ToggleEvaluationQuestionStatus(int id)
        {
            try
            {
                var question = await Task.Run(() =>
                    unitOfWork.ctx.TblEvaluationQuestions.FirstOrDefault(q => q.Id == id)
                );

                if (question == null)
                    return false;

                // Current status
                bool currentStatus = question.IsActive;

                // Toggle status
                question.IsActive = !currentStatus;

                // Update timestamps
                if (!currentStatus)
                {
                    // It is becoming ACTIVE
                    question.DeactivatedAt = null;
                }
                else
                {
                    // It is becoming INACTIVE
                    question.DeactivatedAt = DateTime.UtcNow;
                }

                // Always update CreatedAt (optional)
                question.CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
                

                await Task.Run(() =>
                {
                    unitOfWork.ctx.TblEvaluationQuestions.Update(question);
                    unitOfWork.ctx.SaveChanges();
                });

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error toggling question: " + ex.Message);
                return false;
            }
        }



    }
}
