'use client';

import { useState, useCallback } from 'react';

interface FileDropProps {
  onFileSelect: (file: File) => void;
  accept?: string[];
  maxSize?: number;
}

const DEFAULT_ACCEPT = ['.csv'];
const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function FileDrop({ 
  onFileSelect, 
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE 
}: FileDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!accept.includes(fileExtension)) {
      setError(`Invalid file type. Accepted types: ${accept.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return false;
    }

    setError(null);
    return true;
  }, [accept, maxSize]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [validateFile, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [validateFile, onFileSelect]);

  return (
    <div className="w-full">
      <div
        className={`
          relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors
          ${isDragging 
            ? 'border-gray-900 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Upload Icon */}
        <svg
          className="mb-4 h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {/* Text */}
        <p className="text-lg font-medium text-gray-900">
          Drag and drop your CSV file here
        </p>
        <p className="mt-1 text-sm text-gray-500">
          or click to browse (max {(maxSize / 1024 / 1024).toFixed(0)}MB)
        </p>

        {/* Hidden File Input */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept.join(',')}
          onChange={handleFileInput}
        />
        <label
          htmlFor="file-upload"
          className="mt-4 cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Select File
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
