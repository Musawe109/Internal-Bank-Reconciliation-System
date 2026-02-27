'use client';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  fileName?: string;
}

export default function UploadProgress({ progress, status, fileName }: UploadProgressProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return `Uploading... ${progress}%`;
      case 'processing':
        return 'Processing file...';
      case 'completed':
        return 'Upload completed';
      case 'failed':
        return 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow">
      {fileName && (
        <p className="mb-2 text-sm font-medium text-gray-900">{fileName}</p>
      )}
      
      {/* Progress Bar */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm text-gray-600">{getStatusText()}</p>
        {status === 'completed' && (
          <span className="text-sm font-medium text-green-600">✓</span>
        )}
        {status === 'failed' && (
          <span className="text-sm font-medium text-red-600">✗</span>
        )}
      </div>
    </div>
  );
}
