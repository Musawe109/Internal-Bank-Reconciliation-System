/**
 * Upload Detail Modal - Shows detailed information about an upload.
 */

'use client';

import type { CSVUpload } from '@/lib/types/upload';

interface UploadDetailModalProps {
  upload: CSVUpload;
  onClose: () => void;
}

export default function UploadDetailModal({ upload, onClose }: UploadDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900">Upload Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Filename</label>
              <p className="mt-1 text-base text-gray-900">{upload.filename}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Upload Type</label>
              <p className="mt-1 text-base text-gray-900">
                {upload.uploadType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    upload.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : upload.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {upload.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Records</label>
                <p className="mt-1 text-base text-gray-900">{upload.recordCount ?? '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Processed</label>
                <p className="mt-1 text-base text-gray-900">{upload.processedCount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Errors</label>
                <p className="mt-1 text-base text-gray-900">{upload.errorCount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                <p className="mt-1 text-base text-gray-900">{upload.uploadedBy}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Uploaded At</label>
                <p className="mt-1 text-base text-gray-900">
                  {new Date(upload.uploadedAt).toLocaleString()}
                </p>
              </div>
              {upload.completedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Completed At</label>
                  <p className="mt-1 text-base text-gray-900">
                    {new Date(upload.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {upload.errorMessage && (
              <div>
                <label className="text-sm font-medium text-gray-500">Error Message</label>
                <div className="mt-1 rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{upload.errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
