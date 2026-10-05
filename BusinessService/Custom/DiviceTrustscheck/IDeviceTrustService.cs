using BusinessData.DataContext;
using BusinessService.Common;
using System.Threading.Tasks;

namespace BusinessService.Custom.DiviceTrustscheck
{
    public interface IDeviceTrustService : IEntityService<TrustedDevice>
    {
        Task<bool> IsTrustedAsync(string userId, string rawDeviceId);
        Task TrustDeviceAsync(string userId, string rawDeviceId, int expiryDays = 30);
        Task RevokeAllAsync(string userId);
    }
}
