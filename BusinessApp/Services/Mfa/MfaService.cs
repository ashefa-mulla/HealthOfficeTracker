using BusinessApp.Models;
using Google.Authenticator;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace BusinessApp.Services.Mfa
{
    public class MfaService : IMfaService
    {
        private readonly ILogger<MfaService> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public MfaService(ILogger<MfaService> logger, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        public (string SecretKey, string QrCodeUrl) GenerateMfaSetup(ApplicationUser user)
        {
            try
            {
                var key = Guid.NewGuid().ToString().Replace("-", string.Empty).Substring(0, 32);

                var authenticator = new TwoFactorAuthenticator();
                var setupCode = authenticator.GenerateSetupCode(
                    "HOTracker",
                    user.Email ?? user.UserName ?? "User",
                    key,
                    false,
                    3);

                _logger.LogInformation("MFA setup generated for user: {UserId}", user.Id);
                return (key, setupCode.QrCodeSetupImageUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating MFA setup for user: {UserId}", user.Id);
                throw;
            }
        }

        public bool VerifyMfaToken(string secret, string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(secret) || string.IsNullOrWhiteSpace(token))
                {
                    return false;
                }

                var authenticator = new TwoFactorAuthenticator();
                var isValid = authenticator.ValidateTwoFactorPIN(secret, token.Trim());

                _logger.LogInformation("MFA token validation result: {IsValid}", isValid);
                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating MFA token");
                return false;
            }
        }

        public async Task<bool> EnableMfaAsync(ApplicationUser user, string secret)
        {
            try
            {
                user.MfaEnabled = true;
                user.MfaSecret = secret;
                user.TwoFactorEnabled = true;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    _logger.LogInformation("MFA enabled for user: {UserId}", user.Id);
                    return true;
                }

                _logger.LogWarning("Failed to enable MFA for user: {UserId}", user.Id);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enabling MFA for user: {UserId}", user.Id);
                return false;
            }
        }

        public async Task<bool> DisableMfaAsync(ApplicationUser user)
        {
            try
            {
                user.MfaEnabled = false;
                user.MfaSecret = null;
                user.TwoFactorEnabled = false;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    _logger.LogInformation("MFA disabled for user: {UserId}", user.Id);
                    return true;
                }

                _logger.LogWarning("Failed to disable MFA for user: {UserId}", user.Id);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disabling MFA for user: {UserId}", user.Id);
                return false;
            }
        }
    }
}
