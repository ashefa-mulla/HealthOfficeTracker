using System.Collections.Generic;
using System.Linq;

namespace BusinessApp.Hubs
{
    public sealed class UserPresenceTracker
    {
        private readonly Dictionary<string, HashSet<string>> _onlineUsers = new();
        private readonly object _lock = new();

        public bool UserConnected(string userId, string connectionId)
        {
            lock (_lock)
            {
                if (_onlineUsers.TryGetValue(userId, out var connections))
                {
                    connections.Add(connectionId);
                    return false; // already online
                }

                _onlineUsers[userId] = new HashSet<string> { connectionId };
                return true; // first connection
            }
        }

        public bool UserDisconnected(string userId, string connectionId)
        {
            lock (_lock)
            {
                if (!_onlineUsers.TryGetValue(userId, out var connections))
                    return false;

                connections.Remove(connectionId);

                if (connections.Count == 0)
                {
                    _onlineUsers.Remove(userId);
                    return true; // fully offline
                }

                return false;
            }
        }

        public List<string> GetOnlineUsers()
        {
            lock (_lock)
            {
                return _onlineUsers.Keys.ToList();
            }
        }
    }
}
