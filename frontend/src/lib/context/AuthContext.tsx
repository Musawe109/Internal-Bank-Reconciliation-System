/**
 * Authentication context for managing user session.
 */

'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as loginApi, logout as logoutApi } from '@/lib/api/auth';
import type { User, LoginRequest } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ibrs_auth';

interface StoredAuth {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { user: storedUser } = JSON.parse(stored) as StoredAuth;
        setUser(storedUser);
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setError(null);
    try {
      const response = await loginApi(data);
      const { user: userData, accessToken, refreshToken, expiresIn } = response;

      setUser(userData);

      // Store auth data
      const expiresAt = Date.now() + expiresIn * 1000;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: userData,
          accessToken,
          refreshToken,
          expiresAt,
        } as StoredAuth)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { refreshToken } = JSON.parse(stored) as StoredAuth;
        await logoutApi(refreshToken);
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
