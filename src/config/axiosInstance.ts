/**
 * Axios Instance Configuration for HO Tracker
 */

import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { axiosErrorToApiError } from '../types/errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().jwt;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[AxiosInstance] Request error:', error.message);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = axiosErrorToApiError(error);
    return Promise.reject(apiError);
  }
);

export default instance;
