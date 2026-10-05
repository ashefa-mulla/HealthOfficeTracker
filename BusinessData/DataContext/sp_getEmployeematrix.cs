using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
   public  class sp_getEmployeematrix
    {
        public int Template_id { get; set; }
        public int Employee_id { get; set; }
        public string  Evaluation_Date { get; set; }
        public string Formname { get; set; }
        public string Formjson { get; set; }
        public string Data { get; set; }
        public int TotalScore { get; set; }
        public int MaxScore { get; set; }
        public string TotalScoreper { get; set; }
    }
}
