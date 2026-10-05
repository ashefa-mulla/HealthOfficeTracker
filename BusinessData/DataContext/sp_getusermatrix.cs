using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BusinessData.DataContext
{
   public class sp_getusermatrix
    {
        public int Id { get; set; }
        [Column("Employee_id")]
        public int? EmployeeId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? Date { get; set; }
        [StringLength(1000)]
        public string Formname { get; set; }
        public string Formjson { get; set; }
        public bool? Active { get; set; }
        public DateTime? Evaluation_date { get; set; }

    }
}
