using System;

namespace BusinessApp.Models
{
    public class UserTaskProjectSummaryItem
    {
        public int RowNo { get; set; }
        public string Project { get; set; }
        public string Duration { get; set; }
        public int SecondValue { get; set; }
        public double Hours { get; set; }
    }

    public class UserTaskDailySummaryItem
    {
        public string FormattedDate { get; set; }
        public string Duration { get; set; }
        public int SecondValue { get; set; }
        public double Hours { get; set; }
    }

    public class UserTaskActivityLogItem
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
    }
}
