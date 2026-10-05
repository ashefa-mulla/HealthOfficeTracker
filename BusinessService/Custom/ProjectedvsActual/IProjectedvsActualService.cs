using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.ProjectedvsActual
{
    public interface IProjectedvsActualService
    {

        Task<TblProjectedvsActual> Get(int ID);
        Task<bool> tblinsert(TblProjectedvsActual tbl);
        Task<bool> tblupdate(TblProjectedvsActual tbl);
        Task<IEnumerable<UpdateTrackerSummarybyMonth_ProjectedvsActual_Result>> UpdateActualIncome(string month, string year);
    }
}
