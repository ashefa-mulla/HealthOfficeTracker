using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessApp.Models
{
    public class ReportPara
    {
        public int ID { get; set; }
        public DateTime StDt { get; set; }
        public DateTime EndDt { get; set; }
        public int monthh { get; set; }
        public int year { get; set; }
        public int project_id { get; set; }
        public int invoicelayout { get; set; }
        public int invoiceactive { get; set; }
    }
}
