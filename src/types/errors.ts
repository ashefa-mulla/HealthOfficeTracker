/**
 * Error Types and Utilities for HO Tracker
 */

import axios from 'axios';

export interface ApiErrorData {
  code?: string | number;
  message?: string;
  details?: Record<string, any>;
  errors?: Array<{ field?: string; message: string }>;
  [key: string]: any;
}

export interface ApiErrorResponse {
  status: number;
  statusText: string;
  data?: ApiErrorData;
  message: string;
  code?: string;
  retryable: boolean;
  timestamp: string;
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: ApiErrorData;
  public code?: string;
  public retryable: boolean;
  public originalError?: any;

  constructor(
    message: string,
    status: number = 500,
    statusText: string = 'Internal Server Error',
    data?: ApiErrorData,
    originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.originalError = originalError;
    this.code = data?.code as string;
    this.retryable = status >= 500 || status === 408 || status === 429 || status === 0;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const extractErrorMessage = (data: any): string | null => {
  if (!data) return null;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  if (typeof data.msg === 'string' && data.msg.trim()) return data.msg;

  if (data.errors) {
    if (Array.isArray(data.errors)) {
      const first = data.errors[0];
      if (typeof first === 'string' && first.trim()) return first;
      if (typeof first?.message === 'string' && first.message.trim()) return first.message;
    } else if (typeof data.errors === 'object') {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && data.errors[firstKey]) {
        const val = data.errors[firstKey];
        if (Array.isArray(val) && val[0]) return String(val[0]);
        if (typeof val === 'string' && val.trim()) return val;
      }
    }
  }

  if (typeof data.title === 'string' && data.title.trim()) return data.title;
  return null;
};

export const axiosErrorToApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 0;
    const statusText = error.response?.statusText || 'Unknown Error';
    const data = error.response?.data as ApiErrorData | undefined;
    const message = data?.message || extractErrorMessage(data) || error.message || statusText;
    return new ApiError(message, status, statusText, data, error);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'Internal Server Error');
  }

  if (typeof error === 'string') {
    return new ApiError(error, 500, 'Internal Server Error');
  }

  return new ApiError('An unknown error occurred', 500, 'Internal Server Error');
};

export const getErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorData | undefined;
    const extracted = extractErrorMessage(data);
    if (extracted) return extracted;
    return error.message || 'An unknown error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error) || 'An unknown error occurred';
};
