/**
 * Domain types for upload feature.
 */

import { UploadStatus } from '@/lib/enums/upload-status';

/**
 * CSVUpload represents an uploaded file and its processing status.
 */
export interface CSVUpload {
  uploadId: string;
  filename: string;
  uploadType: UploadType;
  status: UploadStatus;
  recordCount: number | null;
  processedCount: number;
  errorCount: number;
  errorMessage: string | null;
  uploadedBy: string;
  uploadedAt: string; // ISO 8601 format
  completedAt: string | null; // ISO 8601 format
  estimatedCompletionTime: string | null; // ISO 8601 format
}

/**
 * Upload type enumeration.
 */
export enum UploadType {
  BANK_STATEMENT = 'bank_statement',
  INTERNAL_TRANSACTIONS = 'internal_transactions',
}

// Re-export UploadStatus for convenience
export { UploadStatus };
