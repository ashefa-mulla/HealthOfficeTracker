/**
 * Authentication & MFA Service for HO Tracker
 * Integrates primary /api/account/login (used by Angular) and OAuth / 2FA/MFA flows
 */

import axiosInstance from '../config/axiosInstance';
import { axiosErrorToApiError } from '../types/errors';
import { useAuthStore } from '../store/useAuthStore';
import { clearDeviceId } from '../helpers/deviceHelper';
import presenceService from './presenceService';
import { normalizeToken, getJwtFullName } from '../helpers/tokenHelper';

type LoginRequest = Record<string, unknown>;
type AuthResponse = any;
type MfaVerifyRequest = { userId: string; method?: string; [key: string]: unknown };
type MfaVerifyResponse = any;
type MfaSetupResponse = any;
type OAuthCallbackRequest = Record<string, unknown>;

const ENDPOINTS = {
  ACCOUNT_LOGIN: '/api/account/login',
  OAUTH_LOGIN: '/api/oauth/login',
  LOGIN: '/api/account/login',
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

    const rawToken =
      response.access_token ||
      response.accessToken ||
      response.AccessToken;
    const token = normalizeToken(rawToken);

    const username =
      response.username ||
      response.userName ||
      response.UserName ||
      response.email ||
      response.Email ||
      '';

    const userid =
      response.userid ||
      response.userId ||
      response.UserId;

    const employeeid =
      response.Employeeid ||
      response.employeeid ||
      response.EmployeeId ||
      response.employeeId ||
      userid;

    const userrole =
      response.userrole ||
      response.userRole ||
      response.UserRole ||
      '';

    const utype =
      response.utype ??
      response.uType ??
      response.Utype ??
      0;

    const profileimage =
      response.Profileimage ||
      response.profileimage ||
      response.ProfileImage ||
      response.profileImage ||
      '';

    const jwtFullName = getJwtFullName(token);
    let firstName = response.firstName || response.firstname || '';
    let lastName = response.lastName || response.lastname || '';

    if (!firstName && !lastName && jwtFullName && !jwtFullName.includes('@')) {
      const parts = jwtFullName.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const fullName =
      response.fullName ||
      response.fullname ||
      (firstName && lastName ? `${firstName} ${lastName}`.trim() : '') ||
      (jwtFullName && !jwtFullName.includes('@') ? jwtFullName.trim() : '') ||
      username;

    const user =
      response.User ||
      response.user ||
      (username
        ? {
            id: String(userid || employeeid || ''),
            username: username,
            userName: username,
            displayName: fullName,
            fullName: fullName,
            email: response.email || username,
            userRole: userrole,
          }
        : null);

    const profileInfo =
      response.ProfileInfo ||
      response.profileInfo ||
      {
        userId: userid,
        employeeId: employeeid,
        utype: utype,
        entityId: response.entityId || employeeid,
        timezone: response.Timezone || response.timezone,
        isNewUser: response.IsNewUser ?? false,
        userRole: userrole,
        employerId: response.employerId || response.EmployerId,
        branchId: response.BranchId || response.branchId || 1,
        companyId: response.CompanyId || response.companyId || 1,
        profileImage: profileimage,
        offset: response.offset,
        jobStartHr: response.jobstarthr,
        istJobStartHr: response.ISTjobstarthr,
        fullName: fullName,
        firstName: firstName,
        lastName: lastName,
      };

    if (token && !normalizedStatus) {
      normalizedStatus = 'Authenticated';
    }

    return {
      ...response,
      code: response.Code || response.code,
      Code: response.Code || response.code,
      state: response.State || response.state,
      State: response.State || response.state,
      accessToken: token,
      AccessToken: token,
      access_token: token,
      refreshToken: response.RefreshToken || response.refreshToken,
      RefreshToken: response.RefreshToken || response.refreshToken,
      user,
      User: user,
      profileInfo,
      ProfileInfo: profileInfo,
      status: normalizedStatus,
      Status: normalizedStatus,
      userId: userid,
      UserId: userid,
      employeeId: employeeid,
      twoFactorEnabled: response.TwoFactorEnabled || response.twoFactorEnabled,
    };
  }

  private persistSession(normalized: any) {
    const token = normalized.accessToken || normalized.AccessToken;
    if (token) {
      useAuthStore.getState().setJwt(token);
      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', token);

      // Immediately initiate SignalR Presence connection upon login (same as Angular)
      try {
        presenceService.startConnection(token);
      } catch (err) {
        console.warn('[AuthService] Could not auto-start presence service on login:', err);
      }
    }

    const user = normalized.user || normalized.User;
    if (user) {
      useAuthStore.getState().setUser(user);
      localStorage.setItem('authUser', JSON.stringify(user));
      if (user.username || user.userName) {
        localStorage.setItem('currentUser', user.username || user.userName);
      }
    }

    const profile = normalized.profileInfo || normalized.ProfileInfo;
    if (profile) {
      useAuthStore.getState().setProfileInfo(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));

      if (profile.fullName) {
        localStorage.setItem('fullName', profile.fullName);
        localStorage.setItem('displayName', profile.fullName);
      }

      const numUid = profile.userId ?? profile.UserId ?? profile.employeeId ?? profile.id;
      if (numUid) {
        localStorage.setItem('userid', String(numUid));
      }
      const numEid = profile.employeeId ?? profile.EmployeeId ?? numUid;
      if (numEid) {
        localStorage.setItem('employeeid', String(numEid));
      }
      const numCid = profile.companyId ?? profile.CompanyId ?? profile.employerId;
      if (numCid) {
        localStorage.setItem('companyid', String(numCid));
      }
      const numBid = profile.branchId ?? profile.BranchId;
      if (numBid) {
        localStorage.setItem('branchid', String(numBid));
      }
      if (profile.utype !== undefined) {
        localStorage.setItem('sessiontype', String(profile.utype));
      }
      if (profile.userRole) {
        localStorage.setItem('sessionrole', profile.userRole);
      }
      if (profile.offset) {
        localStorage.setItem('offset', String(profile.offset));
      }
      if (profile.jobStartHr) {
        localStorage.setItem('jobstarthr', String(profile.jobStartHr));
      }
      if (profile.istJobStartHr) {
        localStorage.setItem('ISTjobstarthr', String(profile.istJobStartHr));
      }
      if (profile.profileImage) {
        localStorage.setItem('Profileimage', String(profile.profileImage));
      }
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // 1. First attempt /api/account/login (Primary backend endpoint used by Angular)
      // This produces JWT containing ClaimTypes.NameIdentifier = employeedata.Id (required for SignalR Presence)
      try {
        const accountLoginResponse = await this.axiosInstance.post(
          ENDPOINTS.ACCOUNT_LOGIN,
          credentials
        );
        const normalized = this.normalizeResponse(accountLoginResponse.data);
        if (normalized.accessToken) {
          this.persistSession(normalized);
          return normalized;
        }
      } catch (accountErr: any) {
        console.warn(
          '[AuthService] /api/account/login did not complete, trying /api/oauth/login fallback:',
          accountErr?.message || accountErr
        );
      }

      // 2. Fallback to /api/oauth/login (OAuth 2 / MFA flow)
      const loginResponse = await this.axiosInstance.post(ENDPOINTS.OAUTH_LOGIN, credentials);
      const normalized = this.normalizeResponse(loginResponse.data);

      if (normalized.accessToken) {
        this.persistSession(normalized);
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

      if (normalized.accessToken) {
        this.persistSession(normalized);
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
      if (normalized.accessToken) {
        this.persistSession(normalized);
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
      try {
        presenceService.stopConnection();
      } catch (err) {
        // Ignore
      }
      const authStore = useAuthStore.getState();
      authStore.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userid');
      localStorage.removeItem('employeeid');
      localStorage.removeItem('companyid');
      localStorage.removeItem('branchid');
      localStorage.removeItem('sessiontype');
      localStorage.removeItem('sessionrole');
      clearDeviceId();
    } catch (error) {
      console.error('[AuthService] Unexpected logout error:', error);
      try {
        presenceService.stopConnection();
      } catch (err) {
        // Ignore
      }
      const authStore = useAuthStore.getState();
      authStore.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userid');
      localStorage.removeItem('employeeid');
      localStorage.removeItem('companyid');
      localStorage.removeItem('branchid');
      localStorage.removeItem('sessiontype');
      localStorage.removeItem('sessionrole');
      clearDeviceId();
    }
  }
}

export const authService = new AuthService();
export default authService;
