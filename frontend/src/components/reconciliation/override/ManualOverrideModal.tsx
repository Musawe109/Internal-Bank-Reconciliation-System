/**
 * Manual override modal for reconciliation items.
 */

import { useState } from 'react';

interface ManualOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; overrideCode: string }) => Promise<void>;
  itemId: string;
  isLoading?: boolean;
}

export default function ManualOverrideModal({
  isOpen,
  onClose,
  onSubmit,
  itemId,
  isLoading = false,
}: ManualOverrideModalProps) {
  const [reason, setReason] = useState('');
  const [overrideCode, setOverrideCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim()) {
      setError('Please provide a reason for the override');
      return;
    }

    if (!overrideCode.trim()) {
      setError('Please provide an override authorization code');
      return;
    }

    try {
      await onSubmit({ reason, overrideCode });
      // Reset form
      setReason('');
      setOverrideCode('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Override failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-md sm:p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Manual Override</h3>
            <p className="mt-1 text-sm text-gray-500">Item ID: {itemId}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason Field */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Override <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Explain why this manual override is necessary..."
                disabled={isLoading}
              />
            </div>

            {/* Override Code Field */}
            <div>
              <label htmlFor="overrideCode" className="block text-sm font-medium text-gray-700">
                Authorization Code <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="overrideCode"
                value={overrideCode}
                onChange={(e) => setOverrideCode(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Enter your authorization code"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="rounded-md bg-yellow-50 p-3">
              <div className="flex">
                <svg className="h-5 w-5 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                  <p className="mt-1 text-xs text-yellow-700">
                    Manual overrides are logged and require supervisor approval. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Override'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
