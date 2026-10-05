using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class sp_GetEmployeeTaskSummaryByDate_Result
    {
        public string EmployeeId { get; set; }
        public string EmpName { get; set; }
        public string BillableHours { get; set; }
        public string BillablePer { get; set; }
        public string NonBillableHours { get; set; }
        public string VOProuduction { get; set; }
        public string VOPer { get; set; }
        public string TotalHours { get; set; }
        public string UtilizePer { get; set; }
        public string FixedWorkingHours { get; set; }
        public string NonWorkingHours { get; set; }
        public decimal Utilize { get; set; }

    }
}
