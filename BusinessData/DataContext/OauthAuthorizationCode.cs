using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("OAuthAuthorizationCode")]
public partial class OauthAuthorizationCode
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(256)]
    public string Code { get; set; }

    [Required]
    [StringLength(256)]
    public string ClientId { get; set; }

    [Required]
    [StringLength(128)]
    public string UserId { get; set; }

    [Required]
    [StringLength(500)]
    public string RedirectUri { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime IssuedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UsedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("OauthAuthorizationCodes")]
    public virtual AspNetUser User { get; set; }
}
