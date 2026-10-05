using BusinessApp.Models;
using BusinessApp.Services.Jwt;
using BusinessApp.Settings;
using BusinessData.DataContext;
using BusinessService.Custom.Employee;
using BusinessService.Custom.OAuthorizationCode;
using BusinessService.Custom.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace BusinessApp.Controllers
{
    /// <summary>
    /// WebAPI OAuth Controller - Handles authorization code generation and token exchange
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OAuthWebApiController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserService _userService;
        private readonly IEmployeeService _employeeService;
        private readonly IJwtTokenService _tokenService;
        private readonly ILogger<OAuthWebApiController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IOauthAuthorizationService _authorizationService;
        private readonly ApplicationSettings _appSettings;

        public OAuthWebApiController(
            UserManager<ApplicationUser> userManager,
            IUserService userService,
            IEmployeeService employeeService,
            IJwtTokenService tokenService,
            ILogger<OAuthWebApiController> logger,
            IConfiguration configuration,
            IOauthAuthorizationService authorizationService,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _userService = userService;
            _employeeService = employeeService;
            _tokenService = tokenService;
            _logger = logger;
            _configuration = configuration;
            _authorizationService = authorizationService;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// Step 1: Generate authorization code after user authenticates
        /// </summary>
        [HttpPost("authorize")]
        [AllowAnonymous]
        public async Task<IActionResult> Authorize([FromBody] OAuthAuthorizeRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.ClientId) ||
                    string.IsNullOrEmpty(request.RedirectUri) ||
                    string.IsNullOrEmpty(request.UserId))
                {
                    _logger.LogWarning("OAuth authorize: Missing required fields");
                    return BadRequest(new { error = "invalid_request" });
                }

                var validScopes = new[] { "openid", "profile", "email" };
                var requestedScopes = request.Scope?.Split(' ', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();

                if (!requestedScopes.All(s => validScopes.Contains(s)))
                {
                    _logger.LogWarning("OAuth authorize: Invalid scope: {Scope}", request.Scope);
                    return BadRequest(new { error = "invalid_scope" });
                }

                var user = await _userManager.FindByIdAsync(request.UserId);
                if (user == null || !user.IsActive)
                {
                    _logger.LogWarning("OAuth authorize: User not found or inactive: {UserId}", request.UserId);
                    return Unauthorized(new { error = "invalid_grant" });
                }

                var code = GenerateSecureCode(32);
                var authCode = new OauthAuthorizationCode
                {
                    Code = code,
                    ClientId = request.ClientId,
                    UserId = request.UserId,
                    RedirectUri = request.RedirectUri,
                    IssuedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                    IsUsed = false,
                    UsedAt = DateTime.UtcNow
                };

                await _authorizationService.tblInsert(authCode);

                _logger.LogInformation("OAuth authorize: Authorization code generated for user: {UserId}", request.UserId);

                return Ok(new
                {
                    code = code,
                    state = request.State,
                    expires_in = 600
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during OAuth authorize");
                return StatusCode(500, new { error = "server_error" });
            }
        }

        /// <summary>
        /// Step 2: Exchange authorization code for access token
        /// </summary>
        [HttpPost("token")]
        [AllowAnonymous]
        public async Task<IActionResult> ExchangeCodeForToken([FromBody] OAuthTokenRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Code) ||
                    string.IsNullOrEmpty(request.ClientId) ||
                    string.IsNullOrEmpty(request.ClientSecret))
                {
                    _logger.LogWarning("OAuth token: Missing required fields");
                    return BadRequest(new { error = "invalid_request" });
                }

                if (request.GrantType != "authorization_code")
                {
                    _logger.LogWarning("OAuth token: Invalid grant_type: {GrantType}", request.GrantType);
                    return BadRequest(new { error = "unsupported_grant_type" });
                }

                var configClientId = _configuration["OAuth:WebApi:ClientId"];
                var configClientSecret = _configuration["OAuth:WebApi:ClientSecret"];

                if (string.IsNullOrEmpty(configClientId) || string.IsNullOrEmpty(configClientSecret))
                {
                    _logger.LogError("OAuth configuration missing");
                    return StatusCode(500, new { error = "server_error" });
                }

                if (request.ClientId != configClientId || request.ClientSecret != configClientSecret)
                {
                    _logger.LogWarning("OAuth token: Invalid client credentials");
                    return Unauthorized(new { error = "invalid_client" });
                }

                var authCode = await _authorizationService.GetAuthCode(request.Code, request.ClientId, false);

                if (authCode == null)
                {
                    _logger.LogWarning("OAuth token: Authorization code not found or already used: {Code}", request.Code);
                    return BadRequest(new { error = "invalid_grant" });
                }

                if (authCode.ExpiresAt < DateTime.UtcNow)
                {
                    _logger.LogWarning("OAuth token: Authorization code expired: {Code}", request.Code);
                    return BadRequest(new { error = "invalid_grant", error_description = "Code expired" });
                }

                var user = await _userManager.FindByIdAsync(authCode.UserId);

                if (user == null || !user.IsActive)
                {
                    _logger.LogWarning("OAuth token: User not found or inactive: {UserId}", authCode.UserId);
                    return Unauthorized(new { error = "invalid_grant" });
                }

                if (!user.EmailConfirmed)
                {
                    _logger.LogWarning("OAuth token: User email not confirmed: {UserId}", user.Id);
                    return Unauthorized(new { error = "invalid_grant", error_description = "Email not verified" });
                }

                var accessToken = await _tokenService.GenerateAccessTokenAsync(user);

                authCode.IsUsed = true;
                authCode.UsedAt = DateTime.UtcNow;
                await _authorizationService.tblUpdate(authCode);

                _logger.LogInformation("OAuth token: Access token issued for user: {UserId}", user.Id);

                return Ok(new WebApiTokenResponse
                {
                    AccessToken = accessToken,
                    TokenType = "Bearer",
                    ExpiresIn = 3600,
                    UserId = user.Id,
                    Email = user.UserName
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exchanging authorization code for token");
                return StatusCode(500, new { error = "server_error" });
            }
        }

        /// <summary>
        /// Step 3: Get authenticated user profile using Bearer token
        /// </summary>
        [HttpGet("user/profile")]
        [Authorize]
        public async Task<ActionResult<Profile>> GetUserProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("UserID")?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    _logger.LogWarning("GetUserProfile: No user ID in token");
                    return Unauthorized(new { error = "invalid_token" });
                }

                var user = await _userManager.FindByIdAsync(userIdClaim);

                if (user == null || !user.IsActive)
                {
                    _logger.LogWarning("GetUserProfile: User not found or inactive: {UserId}", userIdClaim);
                    return NotFound(new { error = "user_not_found" });
                }

                if (!user.EmailConfirmed)
                {
                    _logger.LogWarning("GetUserProfile: User email not confirmed: {UserId}", user.Id);
                    return Unauthorized(new { error = "email_not_verified" });
                }

                _logger.LogInformation("GetUserProfile: Profile fetched for user: {UserId}", user.Id);

                var profile = await UserProfile(user);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user profile");
                return StatusCode(500, new { error = "server_error" });
            }
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
    }
}
