using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("Tbl_Employee_Device")]
public partial class TblEmployeeDevice
{
    [Key]
    public int Id { get; set; }

    [Column("Emp_Id")]
    public int EmpId { get; set; }

    [Column("User_Id")]
    public int UserId { get; set; }

    [Column("Device_Id")]
    public Guid DeviceId { get; set; }
}
