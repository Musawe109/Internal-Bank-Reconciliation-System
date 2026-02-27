/**
 * API service for upload operations.
 * Centralizes all upload-related API calls.
 */

import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { CSVUpload } from '@/lib/types/upload';

export interface UploadResponse {
  uploadId: string;
  status: string;
  recordCount: number | null;
  estimatedCompletionTime: string | null;
}

export interface UploadHistoryResponse {
  uploads: CSVUpload[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Upload a CSV file
 */
export async function uploadCSV(file: File, uploadType: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', uploadType);

  // Note: File upload needs special handling - using fetch directly
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoints.uploads.csv()}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ code: 'UPLOAD_ERROR', message: 'Upload failed' }));
    throw new Error(error.message);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get upload status
 */
export async function getUploadStatus(uploadId: string): Promise<CSVUpload> {
  const response = await apiClient.get<ApiResponse<CSVUpload>>(endpoints.uploads.status(uploadId));
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

/**
 * Get upload history
 */
export async function getUploadHistory(
  page = 1,
  pageSize = 20,
  status?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<UploadHistoryResponse> {
  const params: Record<string, string> = {
    page: page.toString(),
    pageSize: pageSize.toString(),
  };

  if (status) params.status = status;
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;

  const response = await apiClient.get<UploadHistoryResponse>(endpoints.uploads.history(params));
  return response;
}

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
