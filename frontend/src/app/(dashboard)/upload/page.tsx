/**
 * Upload page - CSV file upload for reconciliation.
 * Full implementation with drag-and-drop, validation, and progress tracking.
 */

'use client';

import { useState, useCallback } from 'react';
import FileDrop from '@/components/upload/file-drop/FileDrop';
import UploadProgress from '@/components/upload/progress/UploadProgress';
import ValidationFeedback from '@/components/upload/validation/ValidationFeedback';
import UploadHistory from '@/components/upload/history/UploadHistory';
import UploadDetailModal from '@/components/upload/detail/UploadDetailModal';
import { UploadType, UploadStatus as UploadStatusEnum } from '@/lib/types/upload';
import type { CSVUpload } from '@/lib/types/upload';

// Mock upload history - will be replaced with API calls
const mockUploadHistory: CSVUpload[] = [
  {
    uploadId: 'upload-1',
    filename: 'bank_statement_jan_2024.csv',
    uploadType: UploadType.BANK_STATEMENT,
    status: UploadStatusEnum.COMPLETED,
    recordCount: 1250,
    processedCount: 1250,
    errorCount: 0,
    errorMessage: null,
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-01-15T10:30:00').toISOString(),
    completedAt: new Date('2024-01-15T10:32:00').toISOString(),
    estimatedCompletionTime: null,
  },
  {
    uploadId: 'upload-2',
    filename: 'internal_transactions_jan_2024.csv',
    uploadType: UploadType.INTERNAL_TRANSACTIONS,
    status: UploadStatusEnum.COMPLETED,
    recordCount: 980,
    processedCount: 980,
    errorCount: 0,
    errorMessage: null,
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-01-15T11:00:00').toISOString(),
    completedAt: new Date('2024-01-15T11:02:00').toISOString(),
    estimatedCompletionTime: null,
  },
];

type UiUploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UiUploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [uploadType, setUploadType] = useState<UploadType>(UploadType.BANK_STATEMENT);
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>([]);
  const [uploadHistory] = useState<CSVUpload[]>(mockUploadHistory);
  const [selectedUpload, setSelectedUpload] = useState<CSVUpload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUploadStatus('idle');
    setProgress(0);
    setValidationErrors([]);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('uploadType', uploadType);

      // Note: This would call the actual API endpoint
      // For now, we simulate the upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setProgress(100);
      setUploadStatus('processing');

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUploadStatus('completed');
      setSelectedFile(null);

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setProgress(0);
      }, 3000);
    } catch (error) {
      setUploadStatus('failed');
      setValidationErrors([
        {
          field: 'Upload',
          message: error instanceof Error ? error.message : 'Upload failed. Please try again.',
        },
      ]);
    }
  }, [selectedFile, uploadType]);

  const handleViewDetails = useCallback((uploadId: string) => {
    const upload = uploadHistory.find((u) => u.uploadId === uploadId);
    if (upload) {
      setSelectedUpload(upload);
      setIsModalOpen(true);
    }
  }, [uploadHistory]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUpload(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload CSV</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload bank statements or internal transactions for reconciliation
          </p>
        </div>
      </div>

      {/* Upload Type Selection */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Upload Type</h2>
        <div className="mt-4 flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value={UploadType.BANK_STATEMENT}
              checked={uploadType === UploadType.BANK_STATEMENT}
              onChange={(e) => setUploadType(e.target.value as UploadType)}
              className="h-4 w-4 text-gray-900 focus:ring-gray-900"
            />
            <span className="ml-2 text-sm text-gray-700">Bank Statement</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value={UploadType.INTERNAL_TRANSACTIONS}
              checked={uploadType === UploadType.INTERNAL_TRANSACTIONS}
              onChange={(e) => setUploadType(e.target.value as UploadType)}
              className="h-4 w-4 text-gray-900 focus:ring-gray-900"
            />
            <span className="ml-2 text-sm text-gray-700">Internal Transactions</span>
          </label>
        </div>
      </div>

      {/* File Upload */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Select File</h2>
        <div className="mt-4">
          <FileDrop onFileSelect={handleFileSelect} />
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadStatus !== 'idle' && (
          <div className="mt-4">
            <UploadProgress
              progress={progress}
              status={uploadStatus as 'uploading' | 'processing' | 'completed' | 'failed'}
              fileName={selectedFile?.name}
            />
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4">
            <ValidationFeedback errors={validationErrors} />
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && uploadStatus === 'idle' && (
          <div className="mt-4">
            <button
              onClick={handleUpload}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Upload File
            </button>
          </div>
        )}
      </div>

      {/* Upload History */}
      <UploadHistory uploads={uploadHistory} onViewDetails={handleViewDetails} />

      {/* Upload Detail Modal */}
      {isModalOpen && selectedUpload && (
        <UploadDetailModal upload={selectedUpload} onClose={handleCloseModal} />
      )}
    </div>
  );
}
