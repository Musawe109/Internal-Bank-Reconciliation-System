/**
 * Configuration module for environment variables and app settings.
 */

export const config = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',

  // Feature Flags
  debugMode: process.env.NEXT_PUBLIC_DEBUG === 'true',

  // Timeouts
  apiTimeout: 30000, // 30 seconds

  // Pagination defaults
  defaultPageSize: 50,
  maxPageSize: 100,

  // Upload limits
  maxUploadSize: 50 * 1024 * 1024, // 50MB

  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,
} as const;

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
