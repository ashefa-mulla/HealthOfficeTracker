using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

public partial class AspNetUser
{
    [Key]
    [StringLength(128)]
    public string Id { get; set; }

    [Required]
    [StringLength(256)]
    public string UserName { get; set; }

    [StringLength(256)]
    public string Email { get; set; }

    public bool EmailConfirmed { get; set; }

    public string PasswordHash { get; set; }

    public string SecurityStamp { get; set; }

    public string PhoneNumber { get; set; }

    public bool PhoneNumberConfirmed { get; set; }

    public bool TwoFactorEnabled { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LockoutEndDateUtc { get; set; }

    public bool LockoutEnabled { get; set; }

    public int AccessFailedCount { get; set; }

    public bool? Isactive { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string ConcurrencyStamp { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LockoutEnd { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string NormalizedEmail { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string NormalizedUserName { get; set; }

    public bool MfaEnabled { get; set; }

    public string MfaSecret { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<AspNetUserClaim> AspNetUserClaims { get; set; } = new List<AspNetUserClaim>();

    [InverseProperty("User")]
    public virtual ICollection<AspNetUserLogin> AspNetUserLogins { get; set; } = new List<AspNetUserLogin>();

    [InverseProperty("User")]
    public virtual ICollection<AspNetUserToken> AspNetUserTokens { get; set; } = new List<AspNetUserToken>();

    [InverseProperty("User")]
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    [InverseProperty("User")]
    public virtual ICollection<TrustedDevice> TrustedDevices { get; set; } = new List<TrustedDevice>();

    [InverseProperty("User")]
    public virtual ICollection<OauthAuthorizationCode> OauthAuthorizationCodes { get; set; } = new List<OauthAuthorizationCode>();

    [ForeignKey("UserId")]
    [InverseProperty("Users")]
    public virtual ICollection<AspNetRole> Roles { get; set; } = new List<AspNetRole>();
}
