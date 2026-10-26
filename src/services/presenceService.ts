/**
 * SignalR Presence Service for Live User Status
 * HO Tracker React (Matches Angular PresenceService)
 */

import * as signalR from '@microsoft/signalr';
import { normalizeToken } from '@/helpers/tokenHelper';

type OnlineUsersCallback = (users: string[]) => void;

class PresenceService {
  private hubConnection: signalR.HubConnection | null = null;
  private listeners: Set<OnlineUsersCallback> = new Set();
  private isConnecting: boolean = false;
  private currentOnlineUsers: string[] = [];
  private activeToken: string = '';

  /**
   * Start SignalR Hub connection with JWT token
   */
  startConnection(token?: string) {
    const rawToken = token || localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
    const validToken = normalizeToken(rawToken);

    if (!validToken) {
      console.warn('[PresenceService] Cannot start connection: No valid JWT token found.');
      return;
    }

    this.activeToken = validToken;

    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    const rawBaseUrl =
      import.meta.env.VITE_API_BASE_URL || 'https://apiprod.govirtualnow.in';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const hubUrl = `${cleanBaseUrl}/presenceHub`;

    try {
      this.isConnecting = true;

      // Match Angular's clean SignalR Hub builder configuration
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => this.activeToken || '',
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Listen for OnlineUsers broadcast from backend PresenceHub
      this.hubConnection.on('OnlineUsers', (users: string[]) => {
        console.log('[PresenceService] Received OnlineUsers from SignalR:', users);
        this.currentOnlineUsers = Array.isArray(users) ? users : [];
        this.notifyListeners(this.currentOnlineUsers);
      });

      this.hubConnection
        .start()
        .then(() => {
          this.isConnecting = false;
          console.log('[PresenceService] Connected successfully to PresenceHub.');
        })
        .catch((err) => {
          this.isConnecting = false;
          console.warn('[PresenceService] SignalR Connection failed:', err?.message || err);
        });

      this.hubConnection.onreconnected(() => {
        this.isConnecting = false;
        console.log('[PresenceService] SignalR reconnected.');
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
        if (
          this.hubConnection.state === signalR.HubConnectionState.Connected ||
          this.hubConnection.state === signalR.HubConnectionState.Connecting
        ) {
          this.hubConnection.stop();
        }
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
