using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_Employer_FirstLevel")]
    public partial class TblEmployerFirstLevel
    {
        public TblEmployerFirstLevel()
        {
            TblEmployerFirstLevelDetails = new HashSet<TblEmployerFirstLevelDetails>();
        }

        [Column("id")]
        public int Id { get; set; }
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        [Column("employee_form_id")]
        public int EmployeeFormId { get; set; }
        [Column("post")]
        [StringLength(300)]
        public string Post { get; set; }
        [Column("interview_date", TypeName = "datetime")]
        public DateTime? InterviewDate { get; set; }
        [Column("interview_by")]
        [StringLength(300)]
        public string InterviewBy { get; set; }
        [Column("total_marks")]
        public int? TotalMarks { get; set; }
        [Column("total_score")]
        public int? TotalScore { get; set; }
        [Column("comments")]
        public string Comments { get; set; }
        [Column("second_level")]
        public bool? SecondLevel { get; set; }
        [Column("active")]
        public bool? Active { get; set; }
        [Column("userId")]
        public int? UserId { get; set; }
        [Column("usertype")]
        public bool? Usertype { get; set; }
        [Column("updated_by")]
        public int? UpdatedBy { get; set; }
        [Column("updated_dt", TypeName = "datetime")]
        public DateTime? UpdatedDt { get; set; }

        [ForeignKey("EmployeeFormId")]
        [InverseProperty("TblEmployerFirstLevel")]
        public TblEmployeeTemplate EmployeeForm { get; set; }
        [InverseProperty("Interview")]
        public ICollection<TblEmployerFirstLevelDetails> TblEmployerFirstLevelDetails { get; set; }
    }
}
