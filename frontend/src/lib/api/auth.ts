/**
 * Authentication API service.
 * Handles login, logout, and token refresh.
 */

import { apiClient } from '../api/client';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from '../types/auth';

const AUTH_BASE_URL = '/api/auth';

/**
 * Login with email and password
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>(`${AUTH_BASE_URL}/login`, data);
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  return apiClient.post<RefreshTokenResponse>(`${AUTH_BASE_URL}/refresh`, {
    refreshToken,
  });
}

/**
 * Logout and invalidate tokens
 */
export async function logout(refreshToken: string): Promise<LogoutResponse> {
  return apiClient.post<LogoutResponse>(`${AUTH_BASE_URL}/logout`, {
    refreshToken,
  });
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  return apiClient.get(`${AUTH_BASE_URL}/me`);
}
