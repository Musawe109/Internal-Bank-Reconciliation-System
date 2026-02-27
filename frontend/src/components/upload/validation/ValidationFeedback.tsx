'use client';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationFeedbackProps {
  errors: ValidationError[];
  warnings?: ValidationError[];
}

export default function ValidationFeedback({ errors, warnings = [] }: ValidationFeedbackProps) {
  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 flex items-center text-sm font-semibold text-red-800">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Validation Errors ({errors.length})
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>
                <span className="font-medium">{error.field}:</span> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="mb-2 flex items-center text-sm font-semibold text-yellow-800">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Warnings ({warnings.length})
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-yellow-700">
            {warnings.map((warning, index) => (
              <li key={index}>
                <span className="font-medium">{warning.field}:</span> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
