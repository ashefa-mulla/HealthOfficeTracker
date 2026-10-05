using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_Employer_Forms")]
    public partial class TblEmployerForms
    {
        public TblEmployerForms()
        {
            TblEmployerFirstLevel = new HashSet<TblEmployerFirstLevel>();
        }

        [Column("id")]
        public int Id { get; set; }
        [Column("employee_id")]
        public int? EmployeeId { get; set; }
        [Column("date", TypeName = "datetime")]
        public DateTime? Date { get; set; }
        [Column("formname")]
        [StringLength(1000)]
        public string Formname { get; set; }
        [Column("formjson")]
        public string Formjson { get; set; }
        [Column("active")]
        public bool? Active { get; set; }

        [ForeignKey("EmployeeId")]
        [InverseProperty("TblEmployerForms")]
        public TblEmployer Employee { get; set; }
        [InverseProperty("EmployeeForm")]
        public ICollection<TblEmployerFirstLevel> TblEmployerFirstLevel { get; set; }
    }
}
