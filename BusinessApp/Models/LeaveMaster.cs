using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace BusinessApp.Models
{
    public class LeaveMaster
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "Account Year field is required")]
        public int AcYear { get; set; }
        [Required(ErrorMessage = "Employee field is required")]
        public int EmpId { get; set; }
        [Required(ErrorMessage = "Assign Leaves field is required")]
        public decimal AssignLeaves { get; set; }
        public decimal? UsedLeaves { get; set; }
        public decimal? BalanceLeaves { get; set; }
        public decimal? AssignSickLeaves { get; set; }
        public decimal? UsedSickLeaves { get; set; }
        public decimal? BalanceSickLeaves { get; set; }
        public decimal? Lwp { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
