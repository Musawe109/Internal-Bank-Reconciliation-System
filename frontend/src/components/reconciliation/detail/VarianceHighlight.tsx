/**
 * Variance highlight component for displaying reconciliation differences.
 */

interface VarianceHighlightProps {
  variance: number;
  percentage?: number;
}

export default function VarianceHighlight({ variance, percentage }: VarianceHighlightProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const isPositive = variance > 0;
  const isZero = variance === 0;

  return (
    <div className={`rounded-lg p-6 ${isZero ? 'bg-green-50' : isPositive ? 'bg-yellow-50' : 'bg-red-50'} shadow`}>
      <h2 className="text-lg font-semibold text-gray-900">Variance</h2>
      
      <div className="mt-4 flex items-baseline space-x-4">
        <span className={`text-3xl font-bold ${isZero ? 'text-green-600' : isPositive ? 'text-yellow-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{formatCurrency(variance)}
        </span>
        {percentage !== undefined && (
          <span className={`text-sm font-medium ${isZero ? 'text-green-600' : isPositive ? 'text-yellow-600' : 'text-red-600'}`}>
            ({isPositive ? '+' : ''}{percentage.toFixed(2)}%)
          </span>
        )}
      </div>

      <div className="mt-4">
        {isZero ? (
          <div className="flex items-center text-sm text-green-700">
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Transactions match perfectly
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Requires investigation and classification
          </div>
        )}
      </div>
    </div>
  );
}
