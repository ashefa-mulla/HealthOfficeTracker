using BusinessData.DataContext;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BusinessData.CommonRepository
{
    public interface IUnitOfWork : IDisposable
    {
        BusinessDbContext ctx { get; }
        Task Commit();
    }
}
