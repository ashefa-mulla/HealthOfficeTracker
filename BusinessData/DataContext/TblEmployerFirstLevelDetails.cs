using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessData.DataContext
{
    [Table("Tbl_Employer_FirstLevel_Details")]
    public partial class TblEmployerFirstLevelDetails
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("interview_id")]
        public int InterviewId { get; set; }
        [Required]
        [Column("column_name")]
        [StringLength(300)]
        public string ColumnName { get; set; }
        [Required]
        [Column("question")]
        [StringLength(1500)]
        public string Question { get; set; }
        [Required]
        [Column("column_type")]
        [StringLength(300)]
        public string ColumnType { get; set; }
        [Column("answer")]
        [StringLength(500)]
        public string Answer { get; set; }
        [Column("comments")]
        [StringLength(1000)]
        public string Comments { get; set; }
        [Column("maxrating")]
        public int? Maxrating { get; set; }
        [Column("questionid")]
        public int? Questionid { get; set; }
        [Column("userId")]
        public int? UserId { get; set; }
        [Column("usertype")]
        public bool? Usertype { get; set; }

        [ForeignKey("InterviewId")]
        [InverseProperty("TblEmployerFirstLevelDetails")]
        public TblEmployerFirstLevel Interview { get; set; }
    }
}
