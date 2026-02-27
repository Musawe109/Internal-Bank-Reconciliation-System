/**
 * Upload status enumeration for CSV processing.
 */
export enum UploadStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Get display label for upload status
 */
export function getUploadStatusLabel(status: UploadStatus): string {
  const labels: Record<UploadStatus, string> = {
    [UploadStatus.PROCESSING]: 'Processing',
    [UploadStatus.COMPLETED]: 'Completed',
    [UploadStatus.FAILED]: 'Failed',
  };
  return labels[status];
}

/**
 * Get CSS color class for upload status badge
 */
export function getUploadStatusColor(status: UploadStatus): string {
  const colors: Record<UploadStatus, string> = {
    [UploadStatus.PROCESSING]: 'bg-yellow-100 text-yellow-800',
    [UploadStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [UploadStatus.FAILED]: 'bg-red-100 text-red-800',
  };
  return colors[status];
}
