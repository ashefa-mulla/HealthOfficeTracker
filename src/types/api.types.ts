/**
 * API Request/Response Types for HO Tracker
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiPageResponse<T> {
  data: T[];
  xpage: {
    currentPage: number;
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  message?: string;
}

export interface SaveResponse {
  message: string;
  success: boolean;
  [key: string]: any;
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface SelectStringOption {
  value: string;
  label: string;
}


export interface UserDto {
  id?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  mfaEnabled?: boolean;
  twoFactorEnabled?: boolean;
  [key: string]: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  code?: string | number;
  Code?: string | number;
  success?: boolean;
  message?: string;
  Message?: string;
  accessToken?: string;
  AccessToken?: string;
  refreshToken?: string;
  RefreshToken?: string;
  user?: UserDto;
  User?: UserDto;
  profileInfo?: any;
  ProfileInfo?: any;
  userId?: string | number;
  UserId?: string | number;
  status?: string | number;
  Status?: string | number;
  state?: string;
  State?: string;
  trustedDevice?: boolean;
  twoFactorEnabled?: boolean;
  TwoFactorEnabled?: boolean;
  [key: string]: any;
}

export interface MfaVerifyRequest {
  userId: string;
  token: string;
  method?: string;
  TrustDevice?: boolean;
  TrustDays?: number;
}

export interface MfaVerifyResponse {
  success?: boolean;
  message?: string;
  code?: string;
  Code?: string;
  state?: string;
  State?: string;
  accessToken?: string;
  AccessToken?: string;
  status?: string | number;
  Status?: string | number;
  user?: UserDto;
  profileInfo?: any;
  [key: string]: any;
}

export interface MfaSetupResponse {
  secretKey?: string;
  qrCodeUrl?: string;
  manualEntryKey?: string;
  [key: string]: any;
}

export interface OAuthCallbackRequest {
  code: string;
  state: string;
  provider: string;
  trustedDevice?: boolean;
}
