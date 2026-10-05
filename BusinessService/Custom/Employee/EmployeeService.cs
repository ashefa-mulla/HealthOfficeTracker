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
namespace BusinessService.Custom.Employee
{
    public class EmployeeService : EntityService<TblEmployer>, IEmployeeService
    {
        readonly IUnitOfWork unitOfWork;
        readonly IGenericStoredProcedureRepository<TblEmployer> spRepository;
        private readonly GenericRepository<TblEmployer> genericRepository;
        readonly IGenericRepository<TblEmployer> repository;


        public EmployeeService(IUnitOfWork _unitOfWork, IGenericRepository<TblEmployer> _repository,
            IGenericStoredProcedureRepository<TblEmployer> _spRepository)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
        }

        public async Task<TblEmployer> Get(int ID)
        {
            //return await repository.SelectById(ID);
            return await Task.Run(() => unitOfWork.ctx.TblEmployers.Where(o => o.Id == ID)
                       .FirstOrDefault());
        }
        public async Task<TblEmployer> GetByUserID(int UserID)
        {
            //return await repository.SelectById(ID);
            return await Task.Run(() => unitOfWork.ctx.TblEmployers.Where(o => o.UserId == UserID)
                       .Include(o => o.City)
                       .Include(o => o.State)
                       .Include(o => o.Country)
                       .FirstOrDefault());
        }
        public async Task<bool> tblInsert(TblEmployer tbl)
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

        public async Task<bool> tblUpdate(TblEmployer tbl)
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
        public async Task<IEnumerable<TblEmployer>> Getbyemployerlist()
        {
            return await unitOfWork.ctx.TblEmployers
                       .Include(o => o.City)
                       .Include(o => o.State)
                       .Include(o => o.Country)
               .OrderBy(x=>x.Firstname)
               .ToListAsync();
        }

        public async Task<bool> DeActivateEmployer(int id)
        {
            try
            {
                TblEmployer C = await Get(id);
                C.Active = false;
                await Update(C);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<TblEmployer> GetByUserid(int ID)
        {
            return await repository.SelectById(ID);
        }
        public async Task<bool> ChangeUsername(string IdentityID, string newUsername)
        {
            try
            {
                //AspNetUsers obj = unitOfWork.ctx.AspNetUsers.Where(f => f.Id == IdentityID).First();
                var obj = await unitOfWork.ctx.AspNetUsers
          .FirstOrDefaultAsync(f => f.Id == IdentityID);
                if (obj == null)
                    return false;
                obj.UserName = newUsername;
                obj.NormalizedUserName = newUsername;
                obj.NormalizedEmail = newUsername;
                await unitOfWork.Commit();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<IEnumerable<GetEmployerList_Result>> GetEmployerList(int id)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetEmployerList_Result>("exec GetEmployerList @CID", new SqlParameter("@CID", id));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<GetOffsetByEmployeeID_Result>> GetOffsetByEmployeeID(int id)
        {

            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetOffsetByEmployeeID_Result>("exec GetOffsetByEmployeeID @EID", new SqlParameter("@EID", id));
            }            
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<GetEmployeeByUserID_Result>> GetEmployeeByUserID(int id)
        {
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<GetEmployeeByUserID_Result>("exec GetEmployeeByUserID @UserID", new SqlParameter("@UserID", id));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        public async Task<bool> ChangePassword(string IdentityID, string NewPassword)
        {
            try
            {
                var obj = await unitOfWork.ctx.AspNetUsers.FirstOrDefaultAsync(f => f.Id == IdentityID);

                if (obj == null)
                    return false;

                obj.PasswordHash = NewPassword;
                await unitOfWork.Commit();
                return true;
            }

            catch (Exception ex)
            {
                return false;
            }
        }
         
        //Feedback form 01-20 2025 GJ
        //public async Task<IEnumerable<sp_get_userforfeedbackform_Results>> Getuserforfeedback()
        //{
        //    return await spRepository.ExecWithStoreProcedureAsync<sp_get_userforfeedbackform_Results>("exec sp_get_userforfeedbackform");
        //}


        //public async Task<IEnumerable<sp_get_questionsforfeedbackform_Results>> Getquestionsforfeedback()
        //{
        //    return await spRepository.ExecWithStoreProcedureAsync<sp_get_questionsforfeedbackform_Results>("exec sp_get_questionsforfeedbackform");
        //}

       
    }
}
