using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.CommonRepository
{
    public class GenericRepository<T> : IGenericRepository<T>, IGenericStoredProcedureRepository<T>
        where T : class
    {

        private readonly IUnitOfWork _unitOfWork;
        public GenericRepository(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        //protected BusinessDbContext ctx;

        #region constructor
        //public GenericRepository(BusinessDbContext dbContext)
        //{
        //    this.ctx = dbContext;
        //}
        #endregion

        #region IGenericRepository Methods

        public IEnumerable<T> SelectAll()
        {

            return this._unitOfWork.ctx.Set<T>().AsEnumerable<T>();
        }

        public IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            IEnumerable<T> result = this._unitOfWork.ctx.Set<T>().Where(predicate).AsEnumerable();
            return result;
        }

        /// <summary>
        /// Function to select entity by primary key
        /// </summary>
        /// <param name="pk">Primary key of entity to fetch</param>
        /// <returns></returns>
        public async Task<T> SelectById(object pk)
        {
            return await this._unitOfWork.ctx.Set<T>().FindAsync(pk);
        }



        /// <summary>
        /// Function to insert entity.
        /// </summary>
        /// <param name="entity">entity to be inserted</param>
        public void Insert(T entity)
        {
            this._unitOfWork.ctx.Set<T>().Add(entity);

        }

        /// <summary>
        /// Function to update entity.
        /// </summary>
        /// <param name="entity">entity to be updated</param>
        public void Update(T entity)
        {
            this._unitOfWork.ctx.Entry(entity).State = EntityState.Modified;
        }

        /// <summary>
        /// Deletes the given entity
        /// </summary>
        /// <param name="entity"></param>
        public void Delete(T entity)
        {
            this._unitOfWork.ctx.Set<T>().Remove(entity);
        }
        //Commit
        public int Commit()
        {
            // Save changes with the default options
            return _unitOfWork.ctx.SaveChanges();
        }



        #endregion

        #region IGenericStoredProcedureRepository Methods

        public int ExecScalerWithStoreProcedure(string query, params object[] parameters)
        {
            return this._unitOfWork.ctx.Database.ExecuteSqlRaw(query, parameters);
        }
        ///// <summary>
        ///// Asyncronously executes the given Stored Procedure 
        ///// </summary>
        ///// <param name="query"></param>
        ///// <param name="parameters"></param>
        ///// <returns></returns>
        //public async Task ExecuteWithStoreProcedureAsync(string query, params object[] parameters)
        //{
        //    await _context.Database.ExecuteSqlCommandAsync(query, parameters);
        //}

        // Fire and forget
        /// <summary>
        /// Executes the given Stored Procedure
        /// </summary>
        /// <typeparam name="T">Class</typeparam>
        /// <param name="query">Stored Procedure Name with parameter (e.g "sp_name @param1 @param2")</param>
        /// <param name="parameters">Sql Parameters</param>
        /// <returns></returns>
        public void ExecuteWithStoreProcedure(string query, params object[] parameters)
        {
            this._unitOfWork.ctx.Database.ExecuteSqlRaw(query, parameters);
        }

        /// <summary>
        /// Executes the given Stored Procedure
        /// </summary>
        /// <typeparam name="T">Class</typeparam>
        /// <param name="query">Stored Procedure Name with parameter (e.g "sp_name @param1 @param2")</param>
        /// <param name="parameters">Sql Parameters</param>
        /// <returns>List of Given Class (T)</returns>
        public IEnumerable<T> ExecWithStoreProcedure<T>(string query, params object[] parameters) where T : class
        {
            //string sp = "exec " + query;
            return _unitOfWork.ctx.Set<T>().FromSqlRaw(query, parameters).AsNoTracking().ToList(); ;
        }

        //public async Task<IEnumerable<T>> ExecuteFuntion<T>(string functionName, string parameter) where T : class
        //{
        //    return await ctx.Query<T>().AsNoTracking().FromSqlRaw(string.Format("EXEC {0} {1}", functionName, parameter)).ToListAsync();
        //}

        public async Task<IEnumerable<T>> ExecWithStoreProcedureAsync<T>(string query, params object[] parameters) where T : class
        {
            //string sp = $"exec " + query;
            return await _unitOfWork.ctx.Set<T>().FromSqlRaw(query, parameters).AsNoTracking().ToListAsync(); ;
        }

        public decimal ExecScalerWithQueryAsync(string query, params object[] parameters)
        {
            //DbConnection connection = ;
            using (DbCommand cmd = this._unitOfWork.ctx.Database.GetDbConnection().CreateCommand())
            {
                cmd.CommandText = query;
                decimal result = (decimal)cmd.ExecuteScalar();
                return result;
            }



        }
        #endregion
    }
}
