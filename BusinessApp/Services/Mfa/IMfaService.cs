using BusinessApp.Models;
using System.Threading.Tasks;

namespace BusinessApp.Services.Mfa
{
    public interface IMfaService
    {
        (string SecretKey, string QrCodeUrl) GenerateMfaSetup(ApplicationUser user);
        bool VerifyMfaToken(string secret, string token);
        Task<bool> EnableMfaAsync(ApplicationUser user, string secret);
        Task<bool> DisableMfaAsync(ApplicationUser user);
    }
}
