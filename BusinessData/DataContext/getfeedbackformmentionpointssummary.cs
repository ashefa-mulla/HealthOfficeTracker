using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class getfeedbackformmentionpointssummary
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public int Total_NegativePoints { get; set; }
        public int Total_PositivePoints { get; set; }
        public string SummaryDate { get; set; }
    }
}
