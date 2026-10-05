using BusinessApp.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BusinessApp.Services.Jwt
{
    public interface IJwtTokenService
    {
        Task<(string accessToken, string refreshToken)> GenerateTokensAsync(ApplicationUser user, string clientip);
        Task<string> GenerateAccessTokenAsync(ApplicationUser user);
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
        Task<bool> ValidateRefreshTokenAsync(string token, string userId);
        Task RevokeRefreshTokenAsync(string token);
    }
}
