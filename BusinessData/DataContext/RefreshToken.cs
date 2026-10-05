using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessData.DataContext;

public partial class RefreshToken
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Token { get; set; }

    [Required]
    [StringLength(128)]
    public string UserId { get; set; }

    public DateTime ExpiryDate { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime CreatedAt { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string ClientIp { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("RefreshTokens")]
    public virtual AspNetUser User { get; set; }
}
