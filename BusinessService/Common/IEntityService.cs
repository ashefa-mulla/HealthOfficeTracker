using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Common
{
    public interface IEntityService<T>: IService where T : class
    {
        Task Create(T entity);
        Task Delete(T entity);
        IEnumerable<T> GetAll();
        Task<T> SelectById(object pk);
        Task Update(T entity);
    }
}