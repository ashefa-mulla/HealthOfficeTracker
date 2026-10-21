using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

[Table("OAuthCallbacks")]
public partial class OauthCallback
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Code { get; set; }

    [Required]
    public string State { get; set; }

    [Required]
    [StringLength(256)]
    public string Provider { get; set; }

    [Required]
    [StringLength(128)]
    public string UserId { get; set; }

    public bool IsUsed { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiryDate { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("OauthCallbacks")]
    public virtual AspNetUser User { get; set; }
}
