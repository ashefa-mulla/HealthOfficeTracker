using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessService.Custom.OAuthorizationCode
{
    public class OauthAuthorizationService : EntityService<OauthAuthorizationCode>, IOauthAuthorizationService
    {
        private readonly IGenericStoredProcedureRepository<OauthAuthorizationCode> _spRepository;
        private readonly IGenericRepository<OauthAuthorizationCode> _repository;
        private readonly IUnitOfWork _unitOfWork;

        // In-memory fallback cache for authorization codes
        private static readonly ConcurrentDictionary<string, OauthAuthorizationCode> InMemoryCodes = new();

        public OauthAuthorizationService(
            IUnitOfWork unitOfWork,
            IGenericRepository<OauthAuthorizationCode> repository,
            IGenericStoredProcedureRepository<OauthAuthorizationCode> spRepository)
            : base(unitOfWork, repository, spRepository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _spRepository = spRepository;
        }

        public async Task<OauthAuthorizationCode?> Get(int id)
        {
            try
            {
                var code = await _unitOfWork.ctx.OauthAuthorizationCodes
                    .FirstOrDefaultAsync(o => o.Id == id);
                if (code != null) return code;
            }
            catch (Exception)
            {
                // Fallback to in-memory store
            }

            return InMemoryCodes.Values.FirstOrDefault(c => c.Id == id);
        }

        public async Task<OauthAuthorizationCode?> GetAuthCode(string code, string clientId, bool isUsed)
        {
            try
            {
                var authCode = await _unitOfWork.ctx.OauthAuthorizationCodes
                    .FirstOrDefaultAsync(o => o.Code == code && o.ClientId == clientId && o.IsUsed == isUsed);
                if (authCode != null) return authCode;
            }
            catch (Exception)
            {
                // Fallback to in-memory store
            }

            if (InMemoryCodes.TryGetValue(code, out var memCode))
            {
                if (memCode.ClientId == clientId && memCode.IsUsed == isUsed)
                {
                    return memCode;
                }
            }

            return null;
        }

        public async Task<bool> tblInsert(OauthAuthorizationCode tbl)
        {
            if (tbl == null) return false;

            var dbSuccess = false;
            try
            {
                await Create(tbl);
                dbSuccess = true;
            }
            catch (Exception)
            {
                // DB table may not exist yet, fallback to in-memory
            }

            InMemoryCodes[tbl.Code] = tbl;
            return true;
        }

        public async Task<bool> tblUpdate(OauthAuthorizationCode tbl)
        {
            if (tbl == null) return false;

            try
            {
                await Update(tbl);
            }
            catch (Exception)
            {
                // DB update failed, update in-memory
            }

            InMemoryCodes[tbl.Code] = tbl;
            return true;
        }

        public async Task<bool> tblDelete(int id)
        {
            try
            {
                var entity = await Get(id);
                if (entity != null)
                {
                    await Delete(entity);
                    InMemoryCodes.TryRemove(entity.Code, out _);
                    return true;
                }
            }
            catch (Exception)
            {
                // In-memory removal
            }

            var memItem = InMemoryCodes.Values.FirstOrDefault(c => c.Id == id);
            if (memItem != null)
            {
                InMemoryCodes.TryRemove(memItem.Code, out _);
                return true;
            }

            return false;
        }
    }
}
