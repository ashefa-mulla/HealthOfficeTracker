/**
 * SignalR Presence Service for Live User Status
 * HO Tracker React
 */

import * as signalR from '@microsoft/signalr';

type OnlineUsersCallback = (users: string[]) => void;

class PresenceService {
  private hubConnection: signalR.HubConnection | null = null;
  private listeners: Set<OnlineUsersCallback> = new Set();
  private isConnecting: boolean = false;
  private currentOnlineUsers: string[] = [];

  /**
   * Start SignalR Hub connection with JWT token
   */
  startConnection(token: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    const rawBaseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      'https://localhost:44301/';

    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const hubUrl = `${cleanBaseUrl}/presenceHub`;

    try {
      this.isConnecting = true;
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token || '',
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      this.hubConnection.on('OnlineUsers', (users: string[]) => {
        this.currentOnlineUsers = Array.isArray(users) ? users : [];
        this.notifyListeners(this.currentOnlineUsers);
      });

      this.hubConnection
        .start()
        .then(() => {
          this.isConnecting = false;
        })
        .catch((err) => {
          this.isConnecting = false;
          console.warn('[PresenceService] SignalR Connection failed, operating in offline/fallback mode:', err?.message || err);
        });

      this.hubConnection.onreconnected(() => {
        this.isConnecting = false;
      });

      this.hubConnection.onclose(() => {
        this.isConnecting = false;
      });
    } catch (err) {
      this.isConnecting = false;
      console.warn('[PresenceService] Error setting up hub connection:', err);
    }
  }

  /**
   * Stop SignalR Hub connection
   */
  stopConnection() {
    if (this.hubConnection) {
      try {
        this.hubConnection.stop();
      } catch (err) {
        console.warn('[PresenceService] Error stopping connection:', err);
      }
      this.hubConnection = null;
    }
    this.isConnecting = false;
  }

  /**
   * Subscribe to online users updates
   */
  subscribe(callback: OnlineUsersCallback): () => void {
    this.listeners.add(callback);
    // Immediately notify with current known online users
    if (this.currentOnlineUsers.length > 0) {
      callback(this.currentOnlineUsers);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(users: string[]) {
    this.listeners.forEach((cb) => {
      try {
        cb(users);
      } catch (err) {
        console.error('[PresenceService] Listener notification error:', err);
      }
    });
  }

  getCurrentOnlineUsers(): string[] {
    return this.currentOnlineUsers;
  }
}

export const presenceService = new PresenceService();
export default presenceService;
