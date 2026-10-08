import { create } from 'zustand';

export interface User {
  id?: string;
  userName?: string;
  username?: string;
  email?: string | null;
  displayName?: string;
  mfaEnabled?: boolean;
  twoFactorEnabled?: boolean;
  [key: string]: any;
}

export interface ProfileInfo {
  userId?: number | string;
  utype?: number;
  entityId?: number;
  timezone?: string;
  isNewUser?: boolean;
  userRole?: string;
  employerId?: number;
  branchId?: number;
  companyId?: number;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  offset?: string;
  jobStartHr?: string;
  istJobStartHr?: string;
  [key: string]: any;
}

export interface AuthState {
  jwt: string | null;
  user: User | null;
  profileInfo: ProfileInfo | null;
  isAuthenticated: boolean;
  mfaRequired: boolean;
  mfaUserId: string | null;

  setAuth: (jwt: string, user: User, profileInfo?: ProfileInfo) => void;
  setTokens: (accessToken: string) => void;
  setJwt: (jwt: string) => void;
  setUser: (user: User) => void;
  setProfileInfo: (profile: ProfileInfo) => void;
  setMfaRequired: (userId: string) => void;
  clearMfaRequired: () => void;
  logout: () => void;
  clearAuth: () => void;
  getToken: () => string | null;
  getUser: () => User | null;
  getProfileInfo: () => ProfileInfo | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  jwt: null,
  user: null,
  profileInfo: null,
  isAuthenticated: false,
  mfaRequired: false,
  mfaUserId: null,

  setAuth: (jwt: string, user: User, profileInfo?: ProfileInfo) => {
    set({
      jwt,
      user,
      profileInfo: profileInfo || null,
      isAuthenticated: true,
      mfaRequired: false,
      mfaUserId: null,
    });
  },

  setTokens: (accessToken: string) => {
    set({
      jwt: accessToken,
      isAuthenticated: true,
    });
  },

  setJwt: (jwt: string) => {
    set({ jwt, isAuthenticated: !!jwt });
  },

  setUser: (user: User) => {
    set({ user });
  },

  setProfileInfo: (profileInfo: ProfileInfo) => {
    set({ profileInfo });
  },

  setMfaRequired: (userId: string) => {
    set({
      mfaRequired: true,
      mfaUserId: userId,
      isAuthenticated: false,
    });
  },

  clearMfaRequired: () => {
    set({
      mfaRequired: false,
      mfaUserId: null,
    });
  },

  logout: () => {
    set({
      jwt: null,
      user: null,
      profileInfo: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaUserId: null,
    });
  },

  clearAuth: () => {
    set({
      jwt: null,
      user: null,
      profileInfo: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaUserId: null,
    });
  },

  getToken: () => get().jwt,
  getUser: () => get().user,
  getProfileInfo: () => get().profileInfo,
}));
