using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.CommonRepository
{
    public interface IGenericRepository<T> where T:class
    {
        IEnumerable<T> SelectAll();
        IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate);
        Task<T> SelectById(object pk);
        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
        int Commit();

    }
}
