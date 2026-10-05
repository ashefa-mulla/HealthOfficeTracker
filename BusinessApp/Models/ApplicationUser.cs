using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public bool Isactive { get; set; } = true;

        [NotMapped]
        public bool IsActive
        {
            get => Isactive;
            set => Isactive = value;
        }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        public bool MfaEnabled { get; set; }

        public string? MfaSecret { get; set; }
    }
}
