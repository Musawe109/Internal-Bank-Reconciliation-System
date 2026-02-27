/**
 * API type definitions for request/response handling.
 */

// Generic API response wrapper
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: ApiErrorData;
}

export interface ApiErrorData {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Pagination types
export interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    pagination: PaginationInfo;
  };
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}
