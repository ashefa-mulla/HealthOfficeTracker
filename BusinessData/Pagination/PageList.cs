using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.Pagination
{
    public class PageList<T>:List<T>
    {
        public PageListMetaData PageListMetaData { get; set; }

        public PageList(int count, int pageNumber, int pageSize)
        {
            PageListMetaData = new PageListMetaData()
            {
                Skip = (pageNumber - 1) * pageSize,
                Take = pageSize,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalCount = count,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
        }
    }
}
