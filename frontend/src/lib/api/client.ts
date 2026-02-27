/**
 * Centralized API client for all backend communications.
 * Implements standardized request/response handling with error handling,
 * timeouts, and retry logic.
 */

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  timeout?: number;
  retries?: number;
};

type ApiErrorData = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string[]>;

  constructor(status: number, data: ApiErrorData) {
    super(data.message);
    this.name = 'ApiError';
    this.code = data.code;
    this.status = status;
    this.details = data.details;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timeout');
    this.name = 'TimeoutError';
  }
}

export class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(baseURL: string, timeout = 30000, maxRetries = 3) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, retries = this.maxRetries } = config;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            code: 'UNKNOWN_ERROR',
            message: response.statusText,
          }));
          throw new ApiError(response.status, errorData);
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return {} as T;
        }

        return await response.json();
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error && error.name === 'AbortError') {
          throw new TimeoutError();
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new NetworkError('Network error. Please check your connection.');
        }

        // Retry on network errors
        if (attempt === retries) {
          throw new NetworkError(`Request failed after ${retries} attempts`);
        }

        // Exponential backoff
        await this.delay(1000 * attempt);
      }
    }

    throw new NetworkError('Request failed');
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('ibrs_auth');
    if (!stored) return null;
    try {
      const { accessToken, expiresAt } = JSON.parse(stored);
      // Check if token is expired
      if (expiresAt && Date.now() >= expiresAt) {
        return null;
      }
      return accessToken;
    } catch {
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Set auth token in storage (called after login)
 */
export function setAuthToken(token: string, expiresIn: number): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('ibrs_auth');
  const data = stored ? JSON.parse(stored) : {};
  localStorage.setItem(
    'ibrs_auth',
    JSON.stringify({
      ...data,
      accessToken: token,
      expiresAt: Date.now() + expiresIn * 1000,
    })
  );
}

/**
 * Clear auth token from storage (called after logout)
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ibrs_auth');
}

// Create singleton instance with environment variable
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not configured');
}

export const apiClient = new ApiClient(baseURL || 'http://localhost:8080');
