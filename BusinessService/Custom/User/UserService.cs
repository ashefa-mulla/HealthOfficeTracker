using System;
using System.Collections.Generic;
using System.Text;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
using BusinessService.Common;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Custom.User
{
    public class UserService : EntityService<TblUserMaster>, IUserService
    {

        readonly IGenericStoredProcedureRepository<TblUserMaster> spRepository;
        readonly IGenericRepository<TblUserMaster> repository;
        readonly IUnitOfWork unitOfWork;


        public UserService(IUnitOfWork _unitOfWork, IGenericRepository<TblUserMaster> _repository, IGenericStoredProcedureRepository<TblUserMaster> _spRepository)
            :base(_unitOfWork, _repository, _spRepository)
        {
            repository = _repository;
            spRepository = _spRepository;

        }

        public async Task<TblUserMaster> Get(int id)
        {
            return await repository.SelectById(id);
        }

        public async Task<int> Tbl_Insert(TblUserMaster tbl)
        {
            try
            {
                await Create(tbl);
                return tbl.UserId;
            }
            catch (Exception)
            {
                return tbl.UserId;
            }

        }

        public async Task<bool> Tbl_Update(TblUserMaster tbl)
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

        public async Task<bool> Tbl_Delete(int id)
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
        public async Task<IEnumerable<GetUserId>> GetUserId(string id)
        {
            SqlParameter Id = new SqlParameter("@id", id);
            return await spRepository.ExecWithStoreProcedureAsync<GetUserId>("exec sp_getuserid @id", Id);
        }
        
    }
}
