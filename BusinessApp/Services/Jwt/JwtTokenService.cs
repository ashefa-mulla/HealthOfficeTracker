using BusinessApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BusinessApp.Services.Jwt
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _configuration;
        private readonly AuthenticationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<JwtTokenService> _logger;

        // In-memory fallback cache for refresh tokens
        private static readonly ConcurrentDictionary<string, (string UserId, DateTime ExpiryDate, string ClientIp, bool IsRevoked)> InMemoryTokens = new();

        public JwtTokenService(
            IConfiguration configuration,
            AuthenticationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILogger<JwtTokenService> logger)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<(string accessToken, string refreshToken)> GenerateTokensAsync(ApplicationUser user, string clientip)
        {
            var accessToken = await GenerateAccessTokenAsync(user);
            var refreshToken = GenerateRefreshToken();

            try
            {
                var refreshTokenEntity = new RefreshToken
                {
                    Token = refreshToken,
                    UserId = user.Id,
                    ExpiryDate = DateTime.UtcNow.AddDays(7),
                    ClientIp = clientip,
                    CreatedAt = DateTime.UtcNow,
                    IsRevoked = false
                };

                _dbContext.RefreshTokens.Add(refreshTokenEntity);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to persist refresh token to database, saving to in-memory store");
                InMemoryTokens[refreshToken] = (user.Id, DateTime.UtcNow.AddDays(7), clientip, false);
            }

            _logger.LogInformation("Tokens generated for user: {UserId}", user.Id);
            return (accessToken, refreshToken);
        }

        public async Task<string> GenerateAccessTokenAsync(ApplicationUser user)
        {
            var secretKeyString = _configuration["Jwt:SecretKey"]
                ?? _configuration["ApplicationSettings:App_Token"]
                ?? throw new InvalidOperationException("JWT SecretKey not configured");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKeyString));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim("UserID", user.Id),
                new Claim("mfa_enabled", user.MfaEnabled.ToString())
            };

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var expirationMinutes = 60;
            if (int.TryParse(_configuration["Jwt:ExpirationMinutes"], out int exp) && exp > 0)
            {
                expirationMinutes = exp;
            }

            var token = new JwtSecurityToken(
                issuer: string.IsNullOrEmpty(issuer) ? null : issuer,
                audience: string.IsNullOrEmpty(audience) ? null : audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var secretKeyString = _configuration["Jwt:SecretKey"]
                ?? _configuration["ApplicationSettings:App_Token"]
                ?? throw new InvalidOperationException("JWT SecretKey not configured");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKeyString)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null;
                }

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> ValidateRefreshTokenAsync(string token, string userId)
        {
            try
            {
                var refreshToken = await _dbContext.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == token && rt.UserId == userId);

                if (refreshToken != null)
                {
                    if (refreshToken.IsRevoked) return false;
                    if (refreshToken.ExpiryDate < DateTime.UtcNow)
                    {
                        refreshToken.IsRevoked = true;
                        await _dbContext.SaveChangesAsync();
                        return false;
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Database lookup for refresh token failed, checking in-memory store");
            }

            // Check in-memory store
            if (InMemoryTokens.TryGetValue(token, out var item))
            {
                if (item.UserId == userId && !item.IsRevoked && item.ExpiryDate >= DateTime.UtcNow)
                {
                    return true;
                }
            }

            return false;
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            try
            {
                var refreshToken = await _dbContext.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == token);

                if (refreshToken != null)
                {
                    refreshToken.IsRevoked = true;
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation("Refresh token revoked in database");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to revoke refresh token in database");
            }

            if (InMemoryTokens.TryGetValue(token, out var item))
            {
                InMemoryTokens[token] = (item.UserId, item.ExpiryDate, item.ClientIp, true);
            }
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
