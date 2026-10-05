using System;
using System.Collections.Generic;
using System.Text;
using BusinessData.CommonRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessService.Common
{
    public class EntityService<T> : IEntityService<T> where T: class
    {
        IUnitOfWork _unitOfWork;
        IGenericRepository<T> _repository;
        IGenericStoredProcedureRepository<T> _storedRepository;
        public EntityService(IUnitOfWork unitOfWork, IGenericRepository<T> repository, IGenericStoredProcedureRepository<T> spRepository = null)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _storedRepository = spRepository;
        }

        public virtual async Task Create(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            
            _repository.Insert(entity);
            try
            {
                await _unitOfWork.Commit();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public virtual async Task Delete(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");
            _repository.Delete(entity);
           await _unitOfWork.Commit();
        }

        public virtual IEnumerable<T> GetAll()
        {
            return _repository.SelectAll();
        }

        public virtual async Task Update(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");
            _repository.Update(entity);
            await _unitOfWork.Commit();
        }

        public async Task<T> SelectById(object pk)
        {
            return await _repository.SelectById(pk);
        }
    }
}
