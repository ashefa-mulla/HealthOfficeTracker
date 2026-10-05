using BusinessApp.Models;
using BusinessApp.Services.Jwt;
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
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OAuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtTokenService _tokenService;
        private readonly ILogger<OAuthController> _logger;
        private readonly IUserService _userService;
        private readonly IEmployeeService _employeeService;
        private readonly IDeviceTrustService _deviceTrustService;
        private readonly IOauthAuthorizationService _authorizationService;
        private readonly ApplicationSettings _appSettings;
        private readonly IConfiguration _configuration;

        public OAuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtTokenService tokenService,
            ILogger<OAuthController> logger,
            IUserService userService,
            IEmployeeService employeeService,
            IDeviceTrustService deviceTrustService,
            IOauthAuthorizationService authorizationService,
            IOptions<ApplicationSettings> appSettings,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
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
        /// Initialize OAuth flow - generates authorization URL for login
        /// Supports: google, github, webapi
        /// </summary>
        [HttpPost("init/{provider}")]
        [AllowAnonymous]
        public IActionResult InitializeOAuth(string provider)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(provider))
                {
                    _logger.LogWarning("OAuth init: Provider not specified");
                    return BadRequest(new OAuthInitResponse
                    {
                        Success = false,
                        Message = "Provider is required"
                    });
                }

                var normalizedProvider = provider.ToLower();

                if (!IsValidProvider(normalizedProvider))
                {
                    _logger.LogWarning("OAuth init: Invalid provider: {Provider}", provider);
                    return BadRequest(new OAuthInitResponse
                    {
                        Success = false,
                        Message = $"Unsupported provider: {provider}"
                    });
                }

                var state = Guid.NewGuid().ToString();

                string authorizationUrl = normalizedProvider switch
                {
                    "google" => BuildGoogleAuthUrl(state),
                    "github" => BuildGitHubAuthUrl(state),
                    "webapi" => BuildWebApiAuthUrl(state),
                    _ => throw new ArgumentException($"Unsupported provider: {provider}")
                };

                _logger.LogInformation("OAuth initialized: provider={Provider}", normalizedProvider);

                return Ok(new OAuthInitResponse
                {
                    Success = true,
                    Message = $"Redirecting to {provider} login",
                    AuthorizationUrl = authorizationUrl,
                    State = state
                });
            }
            catch (ArgumentException)
            {
                _logger.LogWarning("Invalid OAuth provider");
                return BadRequest(new OAuthInitResponse
                {
                    Success = false,
                    Message = "Unsupported OAuth provider"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during OAuth initialization");
                return StatusCode(500, new OAuthInitResponse
                {
                    Success = false,
                    Message = "OAuth initialization failed"
                });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid request"
                });
            }

            try
            {
                var user = await _userManager.FindByNameAsync(request.Email);

                if (user == null)
                {
                    _logger.LogWarning("Login attempt with non-existent email");
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                if (!user.IsActive)
                {
                    _logger.LogWarning($"Login attempt for inactive user account: {user.Id}");
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "User account is inactive"
                    });
                }

                // Check email confirmation
                if (!user.EmailConfirmed)
                {
                    _logger.LogWarning($"Login attempt with unconfirmed email: {user.Id}");
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Email address must be verified before logging in"
                    });

                }

                var result = await _signInManager.PasswordSignInAsync(
                    request.Email, request.Password, isPersistent: false, lockoutOnFailure: true);

                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        _logger.LogWarning($"Login attempt on locked account: {user.Id}");
                        return Unauthorized(new AuthResponse
                        {
                            Success = false,
                            Message = "Account is temporarily locked. Please try again later."
                        });
                    }

                    _logger.LogWarning($"Failed login attempt: {user.Id}");
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                //Generate device fingerprint
                string deviceFingerprint = IpAddressHelper.GenerateDeviceFingerprint(HttpContext);
                _logger.LogInformation($"Device fingerprint generated for user: {user.Id}");
                //deviceFingerprint = IpAddressHelper.Hash(deviceFingerprint); // Hash the fingerprint for privacy
                //Check if device is trusted
                bool isDeviceTrusted = false;
                if (_deviceTrustService != null && !string.IsNullOrEmpty(user.Id))
                {
                    try
                    {
                        isDeviceTrusted = await _deviceTrustService.IsTrustedAsync(user.Id, deviceFingerprint);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Error checking device trust for user: {UserId}", user.Id);
                        isDeviceTrusted = false;
                    }
                }

                // Check Two-Factor Authentication (2FA) requirement - Legacy support
                // Only use 2FA if custom MFA is not enabled
                if (user.TwoFactorEnabled && !user.MfaEnabled && !isDeviceTrusted)
                {
                    _logger.LogInformation($"2FA verification required: {user.Id}");
                    return Ok(new AuthResponse
                    {
                        Success = true,
                        Status = AuthStatus.TwoFARequired,
                        Message = "Two-factor authentication required",
                        UserId = user.Id
                    });
                }


                // Check if MFA is enabled
                if (user.MfaEnabled && !isDeviceTrusted)
                {
                    _logger.LogInformation($"MFA verification required: {user.Id}");
                    return Ok(new AuthResponse
                    {
                        Success = true,
                        Status = AuthStatus.RequiresMfa,
                        Message = "MFA verification required",
                        UserId = user.Id
                    });
                }
                //MFA is valid → NOW generate authorization code
                var authCode = await GenerateAuthorizationCodeAsync(user.Id);

                if (string.IsNullOrEmpty(authCode))
                {
                    return StatusCode(500, new AuthResponse
                    {
                        Success = false,
                        Message = "Failed to generate authorization code"
                    });
                }

                //Return authorization code
                return Ok(new
                {
                    Success = true,
                    TrustedDevice = isDeviceTrusted,
                    Code = authCode,
                    State = Guid.NewGuid().ToString(),
                    Message = "MFA verified. Authorization code generated."
                    
                });

            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Failed to communicate with WebAPI during login");
                return StatusCode(502, new AuthResponse
                {
                    Success = false,
                    Message = "Failed to communicate with authentication service"
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Invalid operation during login");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "Login failed"
                });
            }
        }

        /// <summary>
        /// Handle OAuth callback with code and state
        /// Returns: Authenticated (with JWT) OR RequiresMfa (with UserId + Code + State)
        /// Supports: WebApi (token exchange), MFA (authorization code exchange)
        /// </summary>
        [HttpPost("callback")]
        [AllowAnonymous]
        public async Task<IActionResult> HandleOAuthCallback([FromBody] OAuthCallbackRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Status = AuthStatus.Failed,
                    Message = "Invalid request"
                });
            }

            try
            {
                var provider = request.Provider?.ToLower();
                if (!IsValidProvider(provider))
                {
                    _logger.LogWarning("OAuth callback: Invalid provider: {Provider}", request.Provider);
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "Invalid provider"
                    });
                }

                if (string.IsNullOrWhiteSpace(request.Code))
                {
                    _logger.LogWarning("OAuth callback: Authorization code missing");
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "Authorization code is required"
                    });
                }

                _logger.LogInformation("OAuth callback: provider={Provider}", provider);

                if (provider == "webapi")
                {
                    return await HandleWebApiOAuthCallback(request);
                }
                else if (provider == "mfa")
                {
                    return await HandleMfaOAuthCallback(request);
                }
                else
                {
                    return await HandleExternalOAuthCallback(request);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during OAuth callback");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Status = AuthStatus.Failed,
                    Message = "OAuth callback handling failed"
                });
            }
        }

        private async Task<IActionResult> HandleWebApiOAuthCallback(OAuthCallbackRequest request)
        {
            try
            {
                _logger.LogInformation("WebApi OAuth callback processing: code length={Length}", request.Code?.Length);

                var tokenResponse = await ExchangeCodeForTokenAsync(request.Code);

                if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    _logger.LogWarning("WebApi OAuth: Failed to exchange code for token");
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "Failed to exchange authorization code"
                    });
                }

                var user = await _userManager.FindByNameAsync(tokenResponse.Email ?? string.Empty);
                if (user == null && !string.IsNullOrEmpty(tokenResponse.UserId))
                {
                    user = await _userManager.FindByIdAsync(tokenResponse.UserId);
                }

                if (user == null)
                {
                    _logger.LogWarning("WebApi OAuth: User not found: {Email}", tokenResponse.Email);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "User account not found. Please contact system administrator."
                    });
                }

                if (!user.IsActive && !request.TrustedDevice)
                {
                    _logger.LogWarning("WebApi OAuth: Inactive user attempted login: {UserId}", user.Id);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "User account is inactive"
                    });
                }

                if (!user.EmailConfirmed && !request.TrustedDevice)
                {
                    _logger.LogWarning("WebApi OAuth: Unconfirmed email: {UserId}", user.Id);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "Email must be verified before logging in"
                    });
                }

                if (user.MfaEnabled && !request.TrustedDevice)
                {
                    _logger.LogInformation("WebApi OAuth: MFA required for user: {UserId}", user.Id);
                    return Ok(new AuthResponse
                    {
                        Success = true,
                        Status = AuthStatus.RequiresMfa,
                        Message = "MFA verification required",
                        UserId = user.Id
                    });
                }

                var clientIp = IpAddressHelper.GetClientIpAddress(HttpContext);
                var (accessToken, refreshToken) = await _tokenService.GenerateTokensAsync(user, clientIp);

                user.LastLoginAt = DateTime.UtcNow;
                try
                {
                    await _userManager.UpdateAsync(user);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to update user login date: {UserId}", user.Id);
                }

                Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = Request.IsHttps,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                var userDto = MapToUser(user);
                var profile = await UserProfile(user);

                _logger.LogInformation("WebApi OAuth: Login successful: {UserId}", user.Id);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Status = AuthStatus.Authenticated,
                    Message = "OAuth callback successful",
                    AccessToken = accessToken,
                    User = userDto,
                    ProfileInfo = profile,
                    UserId = userDto.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "WebApi OAuth processing failed");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Status = AuthStatus.Failed,
                    Message = "WebApi OAuth processing failed"
                });
            }
        }

        private async Task<IActionResult> HandleMfaOAuthCallback(OAuthCallbackRequest request)
        {
            try
            {
                var tokenResponse = await ExchangeCodeForTokenAsync(request.Code);

                if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    _logger.LogWarning("MFA: Failed to exchange code for token");
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "Failed to exchange authorization code"
                    });
                }

                var user = await _userManager.FindByNameAsync(tokenResponse.Email ?? string.Empty);
                if (user == null && !string.IsNullOrEmpty(tokenResponse.UserId))
                {
                    user = await _userManager.FindByIdAsync(tokenResponse.UserId);
                }

                if (user == null)
                {
                    _logger.LogWarning("MFA: User not found in database: {Email}", tokenResponse.Email);
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "User not found in database"
                    });
                }

                if (!user.MfaEnabled && !request.TrustedDevice)
                {
                    _logger.LogWarning("MFA: User doesn't have MFA enabled: {UserId}", user.Id);
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Status = AuthStatus.Failed,
                        Message = "MFA not enabled for this user"
                    });
                }

                var clientIp = IpAddressHelper.GetClientIpAddress(HttpContext);
                var (accessToken, refreshToken) = await _tokenService.GenerateTokensAsync(user, clientIp);

                user.LastLoginAt = DateTime.UtcNow;
                try
                {
                    await _userManager.UpdateAsync(user);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to update user login date: {UserId}", user.Id);
                }

                Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = Request.IsHttps,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                var userDto = MapToUser(user);
                var profile = await UserProfile(user);

                _logger.LogInformation("MFA OAuth callback successful: {UserId}", user.Id);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Status = AuthStatus.Authenticated,
                    Message = "MFA authentication successful",
                    AccessToken = accessToken,
                    User = userDto,
                    ProfileInfo = profile,
                    UserId = userDto.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MFA callback processing failed");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Status = AuthStatus.Failed,
                    Message = "MFA callback processing failed"
                });
            }
        }

        private async Task<IActionResult> HandleExternalOAuthCallback(OAuthCallbackRequest request)
        {
            return await HandleWebApiOAuthCallback(request);
        }

        private async Task<string?> GenerateAuthorizationCodeAsync(string userId)
        {
            try
            {
                var clientId = _configuration["OAuth:WebApi:ClientId"] ?? "anVzdHRyaWNrd2hpbGVleGFjdGx5d29uZGVyZnVsaG91cm5vcnRoZ2FzZHVzdGZld2U=";
                var redirectUri = _configuration["OAuth:WebApi:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/oauth-callback";

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
                        _logger.LogInformation("Authorization code generated for user: {UserId}", userId);
                        return code;
                    }
                }

                // Fallback via HTTP if service is not directly available
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

                _logger.LogInformation("Authorization code generated for user: {UserId}", userId);
                return code;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating authorization code for user: {UserId}", userId);
                return null;
            }
        }

        private async Task<WebApiTokenResponse?> ExchangeCodeForTokenAsync(string code)
        {
            try
            {
                var clientId = _configuration["OAuth:WebApi:ClientId"] ?? "anVzdHRyaWNrd2hpbGVleGFjdGx5d29uZGVyZnVsaG91cm5vcnRoZ2FzZHVzdGZld2U=";
                var clientSecret = _configuration["OAuth:WebApi:ClientSecret"];
                var redirectUri = _configuration["OAuth:WebApi:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/oauth-callback";

                // First check local authorization service directly
                if (_authorizationService != null)
                {
                    var authCode = await _authorizationService.GetAuthCode(code, clientId, false);
                    if (authCode != null)
                    {
                        if (authCode.ExpiresAt < DateTime.UtcNow)
                        {
                            _logger.LogWarning("Authorization code expired: {Code}", code);
                            return null;
                        }

                        var user = await _userManager.FindByIdAsync(authCode.UserId);
                        if (user == null || !user.IsActive)
                        {
                            _logger.LogWarning("User not found or inactive for code: {Code}", code);
                            return null;
                        }

                        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);

                        authCode.IsUsed = true;
                        authCode.UsedAt = DateTime.UtcNow;
                        await _authorizationService.tblUpdate(authCode);

                        return new WebApiTokenResponse
                        {
                            AccessToken = accessToken,
                            TokenType = "Bearer",
                            ExpiresIn = 3600,
                            UserId = user.Id,
                            Email = user.UserName
                        };
                    }
                }

                // Fallback via HTTP if configured
                var webApiUrl = _configuration["OAuth:WebApi:Url"];
                if (!string.IsNullOrEmpty(webApiUrl) && !string.IsNullOrEmpty(clientSecret))
                {
                    using var client = new HttpClient();
                    var tokenRequest = new
                    {
                        clientId = clientId,
                        clientSecret = clientSecret,
                        code = code,
                        grantType = "authorization_code",
                        redirectUri = redirectUri
                    };

                    var content = new StringContent(
                        JsonSerializer.Serialize(tokenRequest),
                        System.Text.Encoding.UTF8,
                        "application/json");

                    var response = await client.PostAsync($"{webApiUrl}/api/oauthwebapi/token", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        return JsonSerializer.Deserialize<WebApiTokenResponse>(responseContent, options);
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "WebApi token exchange error");
                return null;
            }
        }

        private async Task<Profile?> FetchWebApiUserProfileAsync(string accessToken)
        {
            try
            {
                var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
                var userId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? principal?.FindFirst("UserID")?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    if (user != null)
                    {
                        return await UserProfile(user);
                    }
                }

                return new Profile();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "WebApi user profile fetch error");
                return new Profile();
            }
        }

        [HttpGet("status")]
        [Authorize]
        public async Task<IActionResult> GetOAuthStatus()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("UserID")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("GetOAuthStatus: no user ID");
                    return Unauthorized();
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("GetOAuthStatus: user not found: {UserId}", userId);
                    return NotFound(new { success = false, message = "User not found" });
                }

                return Ok(new
                {
                    success = true,
                    userId = user.Id,
                    emailConfirmed = user.EmailConfirmed,
                    mfaEnabled = user.MfaEnabled,
                    twoFactorEnabled = user.TwoFactorEnabled,
                    providers = new[] { "webapi", "google", "github" }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error fetching OAuth status");
                return StatusCode(500, new { success = false, message = "Error fetching status" });
            }
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest? request)
        {
            var refreshToken = request?.RefreshToken ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Refresh token is required"
                });
            }

            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();
                var token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authHeader.Substring(7)
                    : authHeader;

                var principal = _tokenService.GetPrincipalFromExpiredToken(token);
                var userId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? principal?.FindFirst("UserID")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid token"
                    });
                }

                var isValid = await _tokenService.ValidateRefreshTokenAsync(refreshToken, userId);
                if (!isValid)
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid or expired refresh token"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null || !user.IsActive)
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "User account not active"
                    });
                }

                var clientIp = IpAddressHelper.GetClientIpAddress(HttpContext);
                await _tokenService.RevokeRefreshTokenAsync(refreshToken);
                var (newAccessToken, newRefreshToken) = await _tokenService.GenerateTokensAsync(user, clientIp);

                Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = Request.IsHttps,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                var userDto = MapToUser(user);
                var profile = await UserProfile(user);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Status = AuthStatus.Authenticated,
                    Message = "Token refreshed",
                    User = userDto,
                    ProfileInfo = profile,
                    AccessToken = newAccessToken
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "Failed to refresh token"
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _tokenService.RevokeRefreshTokenAsync(refreshToken);
            }

            Response.Cookies.Delete("refreshToken");
            return Ok(new { success = true, message = "Logged out successfully" });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("UserID")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userDto = MapToUser(user);
                var profile = await UserProfile(user);

                return Ok(new
                {
                    success = true,
                    user = userDto,
                    profile = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching profile");
                return StatusCode(500, new { message = "Error fetching profile" });
            }
        }

        private string BuildGoogleAuthUrl(string state)
        {
            var clientId = _configuration["OAuth:Google:ClientId"];
            var redirectUri = _configuration["OAuth:Google:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/oauth-callback?provider=google";
            var scope = "openid profile email";

            return $"https://accounts.google.com/o/oauth2/v2/auth?" +
                $"client_id={clientId}" +
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                $"&response_type=code" +
                $"&scope={Uri.EscapeDataString(scope)}" +
                $"&state={state}";
        }

        private string BuildGitHubAuthUrl(string state)
        {
            var clientId = _configuration["OAuth:GitHub:ClientId"];
            var redirectUri = _configuration["OAuth:GitHub:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/oauth-callback?provider=github";
            var scope = "user:email";

            return $"https://github.com/login/oauth/authorize?" +
                $"client_id={clientId}" +
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                $"&scope={Uri.EscapeDataString(scope)}" +
                $"&state={state}";
        }

        private string BuildWebApiAuthUrl(string state)
        {
            var clientId = _configuration["OAuth:WebApi:ClientId"];
            var redirectUri = _configuration["OAuth:WebApi:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/oauth-callback?provider=webapi";
            var webApiUrl = _configuration["OAuth:WebApi:Url"] ?? $"{Request.Scheme}://{Request.Host}";
            var scope = Uri.EscapeDataString("openid profile email");

            return $"{webApiUrl}/oauthwebapi/authorize?" +
                $"client_id={clientId}" +
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                $"&response_type=code" +
                $"&scope={scope}" +
                $"&state={state}";
        }

        private static bool IsValidProvider(string? provider)
        {
            var validProviders = new[] { "google", "github", "webapi", "mfa" };
            return !string.IsNullOrEmpty(provider) && validProviders.Contains(provider.ToLower());
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
