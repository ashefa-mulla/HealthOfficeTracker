using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.CommonRepository
{
    public interface IGenericStoredProcedureRepository<T> where T : class
    {
        IEnumerable<T> ExecWithStoreProcedure<T>(string query, params object[] parameters) where T : class;
        Task<IEnumerable<T>> ExecWithStoreProcedureAsync<T>(string query, params object[] parameters) where T : class;

        int ExecScalerWithStoreProcedure(string query, params object[] parameters);

        void ExecuteWithStoreProcedure(string query, params object[] parameters);

        decimal ExecScalerWithQueryAsync(string query, params object[] parameters);
    }
}
