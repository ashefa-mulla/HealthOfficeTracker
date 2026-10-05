using BusinessApp.Models;
using BusinessApp.Services.Jwt;
using BusinessApp.Services.Mfa;
using BusinessApp.Settings;
using BusinessApp.Utilities;
using BusinessData.DataContext;
using BusinessService.Custom.DiviceTrustscheck;
using BusinessService.Custom.Employee;
using BusinessService.Custom.OAuthorizationCode;
using BusinessService.Custom.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MfaController : ControllerBase
    {
        private readonly IMfaService _mfaService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenService _tokenService;
        private readonly ILogger<MfaController> _logger;
        private readonly IUserService _userService;
        private readonly IEmployeeService _employeeService;
        private readonly IDeviceTrustService _deviceTrustService;
        private readonly IOauthAuthorizationService _authorizationService;
        private readonly ApplicationSettings _appSettings;
        private readonly IConfiguration _configuration;

        private static readonly ConcurrentDictionary<string, (string Secret, DateTime Expiry)> TempSecrets = new();

        public MfaController(
            IMfaService mfaService,
            UserManager<ApplicationUser> userManager,
            IJwtTokenService tokenService,
            ILogger<MfaController> logger,
            IUserService userService,
            IEmployeeService employeeService,
            IDeviceTrustService deviceTrustService,
            IOauthAuthorizationService authorizationService,
            IOptions<ApplicationSettings> appSettings,
            IConfiguration configuration)
        {
            _mfaService = mfaService;
            _userManager = userManager;
            _tokenService = tokenService;
            _logger = logger;
            _userService = userService;
            _employeeService = employeeService;
            _deviceTrustService = deviceTrustService;
            _authorizationService = authorizationService;
            _appSettings = appSettings.Value;
            _configuration = configuration;
        }

        /// <summary>
        /// Generate MFA setup - returns QR code URL and secret key
        /// </summary>
        [HttpPost("setup")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateMfaSetup([FromBody] MfaRequest request)
        {
            try
            {
                var userId = request.UserId;

                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("MFA setup: no user ID");
                    return BadRequest(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "UserId is required"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    _logger.LogWarning("MFA setup: user not found: {UserId}", userId);
                    return NotFound(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var (secretKey, qrCodeUrl) = _mfaService.GenerateMfaSetup(user);
                TempSecrets[userId] = (secretKey, DateTime.UtcNow.AddMinutes(10));

                _logger.LogInformation("MFA setup generated for user: {UserId}", userId);

                return Ok(new MfaSetupResponse
                {
                    Success = true,
                    Message = "MFA setup generated successfully",
                    SecretKey = secretKey,
                    QrCodeUrl = qrCodeUrl
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error generating MFA setup");
                return StatusCode(500, new MfaSetupResponse
                {
                    Success = false,
                    Message = "Failed to generate MFA setup"
                });
            }
        }

        /// <summary>
        /// Enable MFA - verify token and save secret
        /// </summary>
        [HttpPost("enable")]
        [AllowAnonymous]
        public async Task<IActionResult> EnableMfa([FromBody] VerifyMfaRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = request.UserId;

                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("MFA enable: no user ID");
                    return BadRequest(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "UserId is required"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    _logger.LogWarning("MFA enable: user not found: {UserId}", userId);
                    return NotFound(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                if (!TempSecrets.TryGetValue(userId, out var tempSecretData))
                {
                    _logger.LogWarning("MFA enable: no setup found: {UserId}", userId);
                    return BadRequest(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "MFA setup not found. Please run setup first."
                    });
                }

                if (DateTime.UtcNow > tempSecretData.Expiry)
                {
                    TempSecrets.TryRemove(userId, out _);
                    _logger.LogWarning("MFA enable: setup expired: {UserId}", userId);
                    return BadRequest(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "MFA setup expired. Please run setup again."
                    });
                }

                var secretKey = tempSecretData.Secret;
                if (!_mfaService.VerifyMfaToken(secretKey, request.Token))
                {
                    _logger.LogWarning("MFA enable: invalid token: {UserId}", userId);
                    return BadRequest(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "Invalid MFA token"
                    });
                }

                var success = await _mfaService.EnableMfaAsync(user, secretKey);

                if (!success)
                {
                    _logger.LogError("MFA enable failed for user: {UserId}", userId);
                    return StatusCode(500, new MfaSetupResponse
                    {
                        Success = false,
                        Message = "Failed to enable MFA"
                    });
                }

                TempSecrets.TryRemove(userId, out _);
                _logger.LogInformation("MFA enabled successfully: {UserId}", userId);

                return Ok(new MfaSetupResponse
                {
                    Success = true,
                    Message = "MFA enabled successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error enabling MFA");
                return StatusCode(500, new MfaSetupResponse
                {
                    Success = false,
                    Message = "Failed to enable MFA"
                });
            }
        }

        /// <summary>
        /// Verify MFA token during login - Unified OAuth 2.0 Flow
        /// Returns authorization code (not JWT) to exchange through /api/oauth/callback
        /// </summary>
        [HttpPost("verify")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyMfa([FromBody] VerifyMfaRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (string.IsNullOrEmpty(request.UserId))
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "UserId is required"
                    });
                }

                var user = await _userManager.FindByIdAsync(request.UserId);

                if (user == null || !user.MfaEnabled || string.IsNullOrEmpty(user.MfaSecret))
                {
                    _logger.LogWarning("MFA verify: invalid user state: {UserId}", request.UserId);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "MFA not enabled for this user"
                    });
                }

                if (!user.EmailConfirmed)
                {
                    _logger.LogWarning("MFA verify: unconfirmed email: {UserId}", user.Id);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Email must be verified"
                    });
                }

                // Verify the MFA token (6-digit code)
                if (!_mfaService.VerifyMfaToken(user.MfaSecret, request.Token))
                {
                    _logger.LogWarning("Invalid MFA token: {UserId}", request.UserId);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid MFA token"
                    });
                }

                // If user wants to trust device
                if (request.TrustDevice && _deviceTrustService != null)
                {
                    try
                    {
                        string deviceFingerprint = IpAddressHelper.GenerateDeviceFingerprint(HttpContext);
                        await _deviceTrustService.TrustDeviceAsync(
                            user.Id,
                            deviceFingerprint,
                            expiryDays: request.TrustDays ?? 30
                        );

                        _logger.LogInformation("Device trusted for user: {UserId}. Expires in {Days} days.", user.Id, request.TrustDays ?? 30);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error trusting device for user: {UserId}", user.Id);
                    }
                }

                // MFA verified successfully - Generate authorization code
                var authCode = await GenerateMfaAuthorizationCodeAsync(user.Id);

                if (string.IsNullOrEmpty(authCode))
                {
                    _logger.LogError("Failed to generate MFA authorization code for user: {UserId}", user.Id);
                    return StatusCode(500, new AuthResponse
                    {
                        Success = false,
                        Message = "Failed to generate authorization code"
                    });
                }

                var state = Guid.NewGuid().ToString();

                _logger.LogInformation("MFA verified and authorization code generated: {UserId}", user.Id);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Status = AuthStatus.RequiresMfa,
                    Message = "MFA verified successfully",
                    Code = authCode,
                    State = state,
                    UserId = user.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error verifying MFA");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "MFA verification failed"
                });
            }
        }

        private async Task<string?> GenerateMfaAuthorizationCodeAsync(string userId)
        {
            try
            {
                var clientId = _configuration["OAuth:WebApi:ClientId"] ?? "anVzdHRyaWNrd2hpbGVleGFjdGx5d29uZGVyZnVsaG91cm5vcnRoZ2FzZHVzdGZld2U=";
                var redirectUri = $"{Request.Scheme}://{Request.Host}/oauth-callback?provider=mfa";

                var code = GenerateSecureCode(32);
                var authCode = new OauthAuthorizationCode
                {
                    Code = code,
                    ClientId = clientId,
                    UserId = userId,
                    RedirectUri = redirectUri,
                    IssuedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                    IsUsed = false,
                    UsedAt = DateTime.UtcNow
                };

                if (_authorizationService != null)
                {
                    var inserted = await _authorizationService.tblInsert(authCode);
                    if (inserted)
                    {
                        _logger.LogInformation("MFA authorization code generated for user: {UserId}", userId);
                        return code;
                    }
                }

                var webApiUrl = _configuration["OAuth:WebApi:Url"];
                if (!string.IsNullOrEmpty(webApiUrl))
                {
                    using var client = new HttpClient();
                    var authRequest = new
                    {
                        clientId = clientId,
                        userId = userId,
                        redirectUri = redirectUri,
                        scope = "openid profile email",
                        state = Guid.NewGuid().ToString()
                    };

                    var content = new StringContent(
                        JsonSerializer.Serialize(authRequest),
                        System.Text.Encoding.UTF8,
                        "application/json");

                    var response = await client.PostAsync(
                        $"{webApiUrl}/api/oauthwebapi/authorize",
                        content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var authCodeResponse = JsonSerializer.Deserialize<JsonElement>(
                            responseContent,
                            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                        if (authCodeResponse.TryGetProperty("code", out var codeElement))
                        {
                            return codeElement.GetString();
                        }
                    }
                }

                return code;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating MFA authorization code");
                return null;
            }
        }

        /// <summary>
        /// Disable MFA
        /// </summary>
        [HttpPost("disable")]
        [Authorize]
        public async Task<IActionResult> DisableMfa([FromBody] DisableMfaRequest request)
        {
            try
            {
                var userId = request.UserId;

                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("MFA disable: no user ID");
                    return BadRequest(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "UserId is required"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    _logger.LogWarning("MFA disable: user not found: {UserId}", userId);
                    return NotFound(new MfaSetupResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var success = await _mfaService.DisableMfaAsync(user);

                if (!success)
                {
                    _logger.LogError("MFA disable failed for user: {UserId}", userId);
                    return StatusCode(500, new MfaSetupResponse
                    {
                        Success = false,
                        Message = "Failed to disable MFA"
                    });
                }

                _logger.LogInformation("MFA disabled: {UserId}", userId);

                return Ok(new MfaSetupResponse
                {
                    Success = true,
                    Message = "MFA disabled successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error disabling MFA");
                return StatusCode(500, new MfaSetupResponse
                {
                    Success = false,
                    Message = "Failed to disable MFA"
                });
            }
        }

        private static string GenerateSecureCode(int length)
        {
            var tokenData = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(tokenData);

            return Convert.ToBase64String(tokenData)
                .Replace("+", "")
                .Replace("/", "")
                .Replace("=", "")
                .Substring(0, Math.Min(length, 32));
        }

        private UserDto MapToUser(ApplicationUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                MfaEnabled = user.MfaEnabled,
                TwoFactorEnabled = user.TwoFactorEnabled,
                EmailConfirmed = user.EmailConfirmed,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            };
        }

        private async Task<Profile> UserProfile(ApplicationUser user)
        {
            try
            {
                var uid = await _userService.GetUserId(user.Id) as List<GetUserId>;
                if (uid != null && uid.Any())
                {
                    var data = uid.First();
                    var employeedata = await _employeeService.GetByUserID(data.UserId);
                    return new Profile
                    {
                        UserId = data.UserId,
                        Utype = data.UserType,
                        EntityId = employeedata?.Id ?? 0,
                        Timezone = data.TimeZone,
                        IsNewUser = false,
                        UserRole = data.UserRole,
                        EmployerId = data.EmployerId,
                        EmployeeId = employeedata?.Id ?? 0,
                        BranchId = employeedata?.Branch != null && employeedata.Branch != 0 ? employeedata.Branch : 1,
                        CompanyId = employeedata?.CompanyId != null && employeedata.CompanyId != 0 ? employeedata.CompanyId : 1,
                        ProfileImage = employeedata?.Profileimage ?? data.ProfileImage ?? "FileServer/DefaultImg/profiles/avatar-mini.png",
                        FirstName = employeedata?.Firstname ?? string.Empty,
                        LastName = employeedata?.Lastname ?? string.Empty,
                        Offset = _appSettings.Offset,
                        JobStartHr = _appSettings.jobstarthr,
                        ISTJobStartHr = _appSettings.ISTjobstarthr
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user profile for user: {UserId}", user.Id);
            }

            return new Profile();
        }
    }
}
