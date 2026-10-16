using System;

namespace BusinessApp.Models
{
    public class UtilizationReportProjectSummaryItem
    {
        public int RowNo { get; set; }
        public string Project { get; set; }
        public string Duration { get; set; }
        public int SecondValue { get; set; }
        public double Hours { get; set; }
    }

    public class UtilizationReportDailySummaryItem
    {
        public string FormattedDate { get; set; }
        public string Duration { get; set; }
        public int SecondValue { get; set; }
        public double Hours { get; set; }
    }

    public class UtilizationReportActivityLogItem
    {
        public int ID { get; set; }
        public string Fullname { get; set; }
        public string Project { get; set; }
        public string Subcategory { get; set; }
        public string Subprojectcategory { get; set; }
        public string FormattedDate { get; set; }
        public string TimeRange { get; set; }
        public string Activity { get; set; }
        public string Duration { get; set; }
        public int SecondValue { get; set; }
        public double Hours { get; set; }
        public bool IsDateMismatch { get; set; }
        public string TextColor { get; set; }
    }
}
