using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace BusinessApp.Hubs
{
    //public class PresenceHub : Hub
    //{
    //    private readonly UserPresenceTracker _tracker;

    //    public PresenceHub(UserPresenceTracker tracker)
    //    {
    //        _tracker = tracker;
    //    }

    //    public override async Task OnConnectedAsync()
    //    {
    //        var userId = Context.UserIdentifier;

    //        if (!string.IsNullOrEmpty(userId))
    //        {
    //            var isOnline = _tracker.UserConnected(userId, Context.ConnectionId);

    //            if (isOnline)
    //            {
    //                await Clients.All.SendAsync("UserOnline", userId);
    //            }
    //        }

    //        await base.OnConnectedAsync();
    //    }

    //    public override async Task OnDisconnectedAsync(Exception? exception)
    //    {
    //        var userId = Context.UserIdentifier;

    //        if (!string.IsNullOrEmpty(userId))
    //        {
    //            var isOffline = _tracker.UserDisconnected(userId, Context.ConnectionId);

    //            if (isOffline)
    //            {
    //                await Clients.All.SendAsync("UserOffline", userId);
    //            }
    //        }

    //        await base.OnDisconnectedAsync(exception);
    //    }

    //    // Called when dashboard loads
    //    public Task<List<string>> GetOnlineUsers()
    //    {
    //        return Task.FromResult(_tracker.GetOnlineUsers());
    //    }
    //}



    public class PresenceHub : Hub
    {
        private static readonly ConcurrentDictionary<string, int> OnlineUsers
            = new();

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            OnlineUsers.AddOrUpdate(userId, 1, (key, count) => count + 1);

            await Clients.All.SendAsync("OnlineUsers", OnlineUsers.Keys.ToList());
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            if (OnlineUsers.TryGetValue(userId, out var count))
            {
                if (count <= 1)
                    OnlineUsers.TryRemove(userId, out _);
                else
                    OnlineUsers[userId] = count - 1;
            }

            await Clients.All.SendAsync("OnlineUsers", OnlineUsers.Keys.ToList());
            await base.OnDisconnectedAsync(exception);
        }
    }
     

}
