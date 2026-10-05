using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Custom.DiviceTrustscheck
{
    public class DeviceTrustService : EntityService<TrustedDevice>, IDeviceTrustService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericStoredProcedureRepository<TrustedDevice> _msDiseaseDetailRepository;
        private readonly IGenericRepository<TrustedDevice> _mDiseaseDetailRepository;

        // In-memory fallback cache for trusted devices
        private static readonly ConcurrentDictionary<string, TrustedDevice> InMemoryDevices = new();

        public DeviceTrustService(
            IUnitOfWork unitOfWork,
            IGenericRepository<TrustedDevice> mDiseaseDetailRepository,
            IGenericStoredProcedureRepository<TrustedDevice> msDiseaseDetailRepository)
            : base(unitOfWork, mDiseaseDetailRepository, msDiseaseDetailRepository)
        {
            _unitOfWork = unitOfWork;
            _mDiseaseDetailRepository = mDiseaseDetailRepository;
            _msDiseaseDetailRepository = msDiseaseDetailRepository;
        }

        private static string Hash(string rawDeviceId)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawDeviceId));
            return Convert.ToHexString(bytes).ToLowerInvariant();
        }

        public async Task<bool> IsTrustedAsync(string userId, string rawDeviceId)
        {
            if (string.IsNullOrWhiteSpace(rawDeviceId) || string.IsNullOrWhiteSpace(userId)) return false;

            var hash = Hash(rawDeviceId);

            try
            {
                var isTrustedDb = await _unitOfWork.ctx.TrustedDevices.AnyAsync(d =>
                    d.UserId == userId &&
                    d.DeviceIdHash == hash &&
                    d.IsRevoked != true &&
                    d.ExpiresAt > DateTime.UtcNow);

                if (isTrustedDb) return true;
            }
            catch (Exception)
            {
                // Fallback to in-memory store if DB table doesn't exist
            }

            var cacheKey = $"{userId}:{hash}";
            if (InMemoryDevices.TryGetValue(cacheKey, out var memDevice))
            {
                return memDevice.IsRevoked != true && memDevice.ExpiresAt > DateTime.UtcNow;
            }

            return false;
        }

        public async Task RevokeAllAsync(string userId)
        {
            try
            {
                var devices = await _unitOfWork.ctx.TrustedDevices
                    .Where(d => d.UserId == userId && d.IsRevoked != true)
                    .ToListAsync();

                foreach (var d in devices)
                {
                    d.IsRevoked = true;
                }

                await _unitOfWork.ctx.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Fallback to in-memory store
            }

            foreach (var kvp in InMemoryDevices.Where(k => k.Value.UserId == userId))
            {
                kvp.Value.IsRevoked = true;
            }
        }

        public async Task TrustDeviceAsync(string userId, string rawDeviceId, int expiryDays = 30)
        {
            var hash = Hash(rawDeviceId);
            var cacheKey = $"{userId}:{hash}";

            try
            {
                var existing = await _unitOfWork.ctx.TrustedDevices
                    .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceIdHash == hash);

                if (existing != null)
                {
                    existing.ExpiresAt = DateTime.UtcNow.AddDays(expiryDays);
                    existing.IsRevoked = false;
                    await Update(existing);
                }
                else
                {
                    var newDevice = new TrustedDevice
                    {
                        UserId = userId,
                        DeviceIdHash = hash,
                        CreatedAt = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
                        IsRevoked = false
                    };
                    await Create(newDevice);
                }
            }
            catch (Exception)
            {
                // Fallback to in-memory store
            }

            InMemoryDevices[cacheKey] = new TrustedDevice
            {
                UserId = userId,
                DeviceIdHash = hash,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
                IsRevoked = false
            };
        }
    }
}
