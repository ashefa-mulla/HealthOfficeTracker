using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employer")]
public partial class TblEmployer
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("Company_ID")]
    public int CompanyId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("emp_title")]
    public int? EmpTitle { get; set; }

    [Required]
    [Column("Employer_Code")]
    [StringLength(10)]
    [Unicode(false)]
    public string EmployerCode { get; set; }

    [Column("firstname")]
    [StringLength(50)]
    [Unicode(false)]
    public string Firstname { get; set; }

    [Column("middlename")]
    [StringLength(50)]
    [Unicode(false)]
    public string Middlename { get; set; }

    [Column("lastname")]
    [StringLength(50)]
    [Unicode(false)]
    public string Lastname { get; set; }

    [Column("designationid")]
    public int? Designationid { get; set; }

    public int? Branch { get; set; }

    [Column("dob", TypeName = "datetime")]
    public DateTime? Dob { get; set; }

    [Column("joining_date", TypeName = "datetime")]
    public DateTime? JoiningDate { get; set; }

    [Column("relieve_date", TypeName = "datetime")]
    public DateTime? RelieveDate { get; set; }

    [Column("Marital_Status")]
    [StringLength(10)]
    [Unicode(false)]
    public string MaritalStatus { get; set; }

    [Column("Payroll_On")]
    public bool PayrollOn { get; set; }

    [Column("No_of_Child")]
    public int? NoOfChild { get; set; }

    [Column("address_line1")]
    [StringLength(100)]
    [Unicode(false)]
    public string AddressLine1 { get; set; }

    [Column("address_line2")]
    [StringLength(100)]
    [Unicode(false)]
    public string AddressLine2 { get; set; }

    [Column("city_id")]
    public int? CityId { get; set; }

    [Column("state_id")]
    public int? StateId { get; set; }

    [Column("country_id")]
    public int? CountryId { get; set; }

    [Column("zip")]
    [StringLength(20)]
    [Unicode(false)]
    public string Zip { get; set; }

    [Column("timezone")]
    [StringLength(60)]
    [Unicode(false)]
    public string Timezone { get; set; }

    [Column("primary_contact")]
    [StringLength(20)]
    [Unicode(false)]
    public string PrimaryContact { get; set; }

    [Column("primary_email")]
    [StringLength(256)]
    [Unicode(false)]
    public string PrimaryEmail { get; set; }

    [Column("alternate_contact")]
    [StringLength(20)]
    [Unicode(false)]
    public string AlternateContact { get; set; }

    [Column("alternate_email")]
    [StringLength(256)]
    [Unicode(false)]
    public string AlternateEmail { get; set; }

    [Column("profileimage")]
    [StringLength(300)]
    [Unicode(false)]
    public string Profileimage { get; set; }

    [Column("CVDoc")]
    [StringLength(300)]
    [Unicode(false)]
    public string Cvdoc { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string AgreementDoc { get; set; }

    [Column("emergencycontactperson")]
    [StringLength(100)]
    [Unicode(false)]
    public string Emergencycontactperson { get; set; }

    [Column("emergencycontact")]
    [StringLength(20)]
    [Unicode(false)]
    public string Emergencycontact { get; set; }

    [Column("comments")]
    [StringLength(1000)]
    [Unicode(false)]
    public string Comments { get; set; }

    [Column("closeOut", TypeName = "datetime")]
    public DateTime? CloseOut { get; set; }

    [Column("active")]
    public bool? Active { get; set; }

    [Required]
    [Column("updated_by")]
    [StringLength(100)]
    [Unicode(false)]
    public string UpdatedBy { get; set; }

    [Column("updated_date", TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    [Column("working_hours")]
    public int? WorkingHours { get; set; }

    [ForeignKey("CityId")]
    [InverseProperty("TblEmployers")]
    public virtual TblCity City { get; set; }

    [ForeignKey("CountryId")]
    [InverseProperty("TblEmployers")]
    public virtual TblCountry Country { get; set; }

    [ForeignKey("Designationid")]
    [InverseProperty("TblEmployers")]
    public virtual TblDesignation Designation { get; set; }

    [ForeignKey("StateId")]
    [InverseProperty("TblEmployers")]
    public virtual TblState State { get; set; }

    [InverseProperty("Employee")]
    public virtual ICollection<TblEmployeeMatrix> TblEmployeeMatrices { get; set; } = new List<TblEmployeeMatrix>();

    [InverseProperty("Employee")]
    public virtual ICollection<TblEmployeeTemplate> TblEmployeeTemplates { get; set; } = new List<TblEmployeeTemplate>();

    [ForeignKey("Timezone")]
    [InverseProperty("TblEmployers")]
    public virtual TblTimezone TimezoneNavigation { get; set; }
}
