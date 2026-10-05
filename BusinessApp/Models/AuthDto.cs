using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessApp.Models
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public AuthStatus Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public UserDto? User { get; set; }
        public Profile? ProfileInfo { get; set; }
        public string? AccessToken { get; set; }

        // MFA flow
        public string? UserId { get; set; }
        public string? Code { get; set; }
        public string? State { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public bool MfaEnabled { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }

    public class Profile
    {
        public int UserId { get; set; }
        public int Utype { get; set; }
        public int EntityId { get; set; }
        public string? Timezone { get; set; }
        public bool IsNewUser { get; set; }
        public string? UserRole { get; set; }
        public int EmployerId { get; set; }
        public int EmployeeId { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? ProfileImage { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Offset { get; set; }
        public string? JobStartHr { get; set; }
        public string? ISTJobStartHr { get; set; }
    }

    public enum AuthStatus
    {
        Failed = 0,
        RequiresMfa = 1,
        Authenticated = 2,
        TwoFARequired = 3
    }

    public class MfaSetupResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? SecretKey { get; set; }
        public string? QrCodeUrl { get; set; }
    }

    public class MfaRequest
    {
        public string UserId { get; set; } = string.Empty;
    }

    public class VerifyMfaRequest
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        public bool TrustDevice { get; set; } = false;
        public int? TrustDays { get; set; } = 30;
    }

    public class DisableMfaRequest
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
    }

    // OAuth DTOs
    public class OAuthCallbackRequest
    {
        public string Code { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty; // "webapi", "mfa", "google", "github"
        public bool TrustedDevice { get; set; } = false;
    }

    public class OAuthInitResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? AuthorizationUrl { get; set; }
        public string? State { get; set; }
    }

    public class OAuthAuthorizeRequest
    {
        public string ClientId { get; set; } = string.Empty;
        public string RedirectUri { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string ResponseType { get; set; } = "code";
        public string Scope { get; set; } = "openid profile email";
        public string? State { get; set; }
    }

    public class OAuthTokenRequest
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string GrantType { get; set; } = "authorization_code";
        public string RedirectUri { get; set; } = string.Empty;
    }

    public class WebApiTokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string TokenType { get; set; } = "Bearer";
        public int ExpiresIn { get; set; } = 3600;
        public string? UserId { get; set; }
        public string? Email { get; set; }
    }
}
