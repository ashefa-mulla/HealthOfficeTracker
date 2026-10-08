/**
 * Authentication & MFA Service for HO Tracker
 * Modeled after VirtualClinic-React OAuth 2 + 2FA/MFA architecture
 */

import axiosInstance from '../config/axiosInstance';
// Keep service request/response types local because api.types.ts has no exports.
type LoginRequest = Record<string, unknown>;
type AuthResponse = any;
type MfaVerifyRequest = { userId: string; method?: string; [key: string]: unknown };
type MfaVerifyResponse = any;
type MfaSetupResponse = any;
type OAuthCallbackRequest = Record<string, unknown>;
import { axiosErrorToApiError } from '../types/errors';
import { useAuthStore } from '../store/useAuthStore';
import { clearDeviceId } from '../helpers/deviceHelper';

const ENDPOINTS = {
  LOGIN: '/api/oauth/login',
  OAUTH_CALLBACK: '/api/oauth/callback',
  MFA_VERIFY: '/api/mfa/verify',
  MFA_SETUP: '/api/mfa/setup',
  MFA_ENABLE: '/api/mfa/enable',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
};

class AuthService {
  private axiosInstance = axiosInstance;

  private normalizeResponse(response: any): any {
    if (!response) return response;

    let normalizedStatus = response.Status ?? response.status;
    if (typeof normalizedStatus === 'number') {
      switch (normalizedStatus) {
        case 0:
          normalizedStatus = 'Failed';
          break;
        case 1:
          normalizedStatus = 'RequiresMfa';
          break;
        case 2:
          normalizedStatus = 'Authenticated';
          break;
        case 3:
          normalizedStatus = 'TwoFARequired';
          break;
        default:
          normalizedStatus = 'Unknown';
      }
    }

    return {
      ...response,
      code: response.Code || response.code,
      Code: response.Code || response.code,
      state: response.State || response.state,
      State: response.State || response.state,
      accessToken: response.AccessToken || response.accessToken,
      AccessToken: response.AccessToken || response.accessToken,
      refreshToken: response.RefreshToken || response.refreshToken,
      RefreshToken: response.RefreshToken || response.refreshToken,
      user: response.User || response.user,
      User: response.User || response.user,
      profileInfo: response.ProfileInfo || response.profileInfo,
      ProfileInfo: response.ProfileInfo || response.profileInfo,
      status: normalizedStatus,
      Status: normalizedStatus,
      userId: response.UserId || response.userId,
      UserId: response.UserId || response.userId,
      twoFactorEnabled: response.TwoFactorEnabled || response.twoFactorEnabled,
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const loginResponse = await this.axiosInstance.post(ENDPOINTS.LOGIN, credentials);
      const normalized = this.normalizeResponse(loginResponse.data);

      const token = normalized.accessToken || normalized.AccessToken;
      if (token) {
        useAuthStore.getState().setJwt(token);
      }

      const user = normalized.user || normalized.User;
      if (user) {
        useAuthStore.getState().setUser(user);
        localStorage.setItem('authUser', JSON.stringify(user));
      }

      const profile = normalized.profileInfo || normalized.ProfileInfo;
      if (profile) {
        useAuthStore.getState().setProfileInfo(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
        const numUid = profile.userId ?? profile.UserId ?? profile.employeeId ?? profile.id;
        if (numUid) {
          localStorage.setItem('userid', String(numUid));
        }
        const numCid = profile.companyId ?? profile.CompanyId ?? profile.employerId;
        if (numCid) {
          localStorage.setItem('companyid', String(numCid));
        }
      }

      return normalized;
    } catch (error) {
      console.error('[AuthService] login() error:', error);
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * Verify MFA 6-digit TOTP code during login
   */
  async verifyMfa(request: MfaVerifyRequest): Promise<MfaVerifyResponse> {
    try {
      console.log('[AuthService] verifyMfa()', { userId: request.userId, method: request.method });
      const response = await this.axiosInstance.post(ENDPOINTS.MFA_VERIFY, request);
      return this.normalizeResponse(response.data);
    } catch (error) {
      console.error('[AuthService] verifyMfa() error:', error);
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * Setup MFA / 2FA (generates QR code and secret key)
   */
  async setupMfa(userId: string): Promise<MfaSetupResponse> {
    try {
      console.log('[AuthService] setupMfa() for userId:', userId);
      const response = await this.axiosInstance.post(ENDPOINTS.MFA_SETUP, {
        userId,
        method: 'totp',
      });
      return response.data;
    } catch (error) {
      console.error('[AuthService] setupMfa() error:', error);
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * Enable MFA after user verifies their first code
   */
  async enableMfa(userId: string, token: string): Promise<any> {
    try {
      console.log('[AuthService] enableMfa() for userId:', userId);
      const response = await this.axiosInstance.post(ENDPOINTS.MFA_ENABLE, {
        userId,
        token,
      });
      return response.data;
    } catch (error) {
      console.error('[AuthService] enableMfa() error:', error);
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * Exchange authorization code for JWT token
   */
  async exchangeCodeForToken(request: OAuthCallbackRequest): Promise<AuthResponse> {
    try {
      console.log('[AuthService] exchangeCodeForToken()', request);
      const response = await this.axiosInstance.post(ENDPOINTS.OAUTH_CALLBACK, request);
      const normalized = this.normalizeResponse(response.data);

      const token = normalized.accessToken || normalized.AccessToken;
      if (token) {
        useAuthStore.getState().setJwt(token);
      }

      const user = normalized.user || normalized.User;
      if (user) {
        useAuthStore.getState().setUser(user);
        localStorage.setItem('authUser', JSON.stringify(user));
      }

      const profile = normalized.profileInfo || normalized.ProfileInfo;
      if (profile) {
        useAuthStore.getState().setProfileInfo(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
        const numUid = profile.userId ?? profile.UserId ?? profile.employeeId ?? profile.id;
        if (numUid) {
          localStorage.setItem('userid', String(numUid));
        }
        const numCid = profile.companyId ?? profile.CompanyId ?? profile.employerId;
        if (numCid) {
          localStorage.setItem('companyid', String(numCid));
        }
      }

      return normalized;
    } catch (error) {
      console.error('[AuthService] exchangeCodeForToken() error:', error);
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.post(ENDPOINTS.REFRESH_TOKEN);
      const normalized = this.normalizeResponse(response.data);
      const token = normalized.accessToken || normalized.AccessToken;
      if (token) {
        useAuthStore.getState().setJwt(token);
      }
      return normalized;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      try {
        await this.axiosInstance.post(ENDPOINTS.LOGOUT);
      } catch (error: any) {
        console.warn('[AuthService] Backend logout failed or token already invalid:', error);
      }
      const authStore = useAuthStore.getState();
      authStore.logout();
      localStorage.removeItem('authUser');
      localStorage.removeItem('userProfile');
      clearDeviceId();
    } catch (error) {
      console.error('[AuthService] Unexpected logout error:', error);
      const authStore = useAuthStore.getState();
      authStore.logout();
      localStorage.removeItem('authUser');
      localStorage.removeItem('userProfile');
      clearDeviceId();
    }
  }
}

export const authService = new AuthService();
export default authService;
