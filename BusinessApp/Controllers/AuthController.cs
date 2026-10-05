using BusinessApp.Models;
using BusinessApp.Services.Jwt;
using BusinessApp.Settings;
using BusinessApp.Utilities;
using BusinessData.DataContext;
using BusinessService.Custom.Employee;
using BusinessService.Custom.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BusinessApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtTokenService _tokenService;
        private readonly ILogger<AuthController> _logger;
        private readonly IUserService _userService;
        private readonly IEmployeeService _employeeService;
        private readonly ApplicationSettings _appSettings;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtTokenService tokenService,
            ILogger<AuthController> logger,
            IUserService userService,
            IEmployeeService employeeService,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _logger = logger;
            _userService = userService;
            _employeeService = employeeService;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// Login user returns JWT
        /// </summary>
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

                // Check if MFA is enabled
                if (user.MfaEnabled)
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

                _logger.LogInformation($"User logged in: {user.Id}");

                return Ok(new AuthResponse
                {
                    Success = true,
                    Status = AuthStatus.Authenticated,
                    Message = "Login successful",
                    User = userDto,
                    ProfileInfo = profile,
                    AccessToken = accessToken
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
        /// Refresh access token using refresh token
        /// </summary>
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
                var userId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

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

        /// <summary>
        /// Revoke refresh token and logout
        /// </summary>
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

        /// <summary>
        /// Get current user profile
        /// </summary>
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
