using BusinessData.DataContext;
using BusinessService.Common;
using System.Threading.Tasks;

namespace BusinessService.Custom.OAuthorizationCode
{
    public interface IOauthAuthorizationService : IEntityService<OauthAuthorizationCode>
    {
        Task<OauthAuthorizationCode?> Get(int id);
        Task<OauthAuthorizationCode?> GetAuthCode(string code, string clientId, bool isUsed);
        Task<bool> tblDelete(int id);
        Task<bool> tblInsert(OauthAuthorizationCode tbl);
        Task<bool> tblUpdate(OauthAuthorizationCode tbl);
    }
}
