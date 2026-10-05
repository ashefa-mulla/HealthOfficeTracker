using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessData.DataContext
{
    public class GetTaskListForUserwithPegination_Results
    {
        public int ID { get; set; }
        public string PointPerson { get; set; }
        public string SecondPerson { get; set; }
        public string AccountablePerson { get; set; }
        public string Project { get; set; }
        public string SubProject { get; set; }
        public string SubProjectCategory { get; set; }
        public string Task { get; set; }
        public string Completed { get; set; }
        public string Status_Percentage { get; set; }
        public string Duration { get; set; }
        public int Projected { get; set; }
        public string Priority { get; set; }
        public string ETAHH { get; set; }
        public string ETAMM { get; set; }
        public DateTime AssignDate { get; set; }
        public DateTime ETA { get; set; }
    }
}
