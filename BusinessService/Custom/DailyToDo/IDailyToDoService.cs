using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AvailAnalytics.Service.Common;
using BusinessData.DataContext;
using BusinessService.Common;

namespace BusinessService.Custom.DailyToDo
{
    public interface IDailyToDoService : IEntityService<TblPunchDetailTodo>
    {
        Task<TblPunchDetailTodo> Get(int ID);
        Task<bool> tbldelete(int id);
        Task<bool> tblinsert(TblPunchDetailTodo tbl);
        Task<bool> tblupdate(TblPunchDetailTodo tbl);
        Task<IEnumerable<GetPunchDetailTodoByEmpID_Result>> GetPunchDetailTodoByEmpID(DateTime FromDate, DateTime ToDate, int EID);
        Task<IEnumerable<GetPuncDetailTodoIDForTodo_Result>> GetPuncDetailTodoIDForTodo(DateTime shift_dt, int EID);
        Task<IEnumerable<sp_gettodotasklist_Result>> GetTodotasklist(int Id);
        Task<IEnumerable<sp_gettasklistforall_Result>> Gettasklistforall();
        

    }
}
