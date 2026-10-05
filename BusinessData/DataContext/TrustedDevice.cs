using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("TrustedDevices")]
public partial class TrustedDevice
{
    [Key]
    public int Id { get; set; }

    [StringLength(128)]
    public string UserId { get; set; }

    [Required]
    [StringLength(256)]
    public string DeviceIdHash { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ExpiresAt { get; set; }

    public bool? IsRevoked { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("TrustedDevices")]
    public virtual AspNetUser User { get; set; }
}
