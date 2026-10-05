using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.Pagination
{
    public class PageListMetaData
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
                         }
}
