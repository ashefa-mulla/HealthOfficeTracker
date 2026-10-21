using BusinessApp.Models;
using System.Threading;
using System.Threading.Tasks;

namespace BusinessApp.Service.Activity
{
    public interface IActivitySyncService
    {
        Task<ActivitySyncResponse> SyncAsync(ActivitySyncRequest request, CancellationToken cancellationToken = default);
    }
}
