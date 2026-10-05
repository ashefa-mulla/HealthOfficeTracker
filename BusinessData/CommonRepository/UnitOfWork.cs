using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;

namespace BusinessData.CommonRepository
{
    public class UnitOfWork : IUnitOfWork
    {
        public BusinessDbContext ctx { get; }

        public UnitOfWork(BusinessDbContext context)
        {
            ctx = context;
        }
        public async Task Commit()
        {
            await ctx.SaveChangesAsync();
        }

        public void Dispose()
        {
            ctx.Dispose();

        }
    }
}
