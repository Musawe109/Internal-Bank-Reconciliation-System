/**
 * Classification dropdown for reconciliation items.
 */

import { ClassificationType } from '@/lib/enums/classification';

interface ClassificationDropdownProps {
  value: ClassificationType | null;
  onChange: (classification: ClassificationType) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const classifications: { value: ClassificationType; label: string }[] = [
  { value: ClassificationType.TIMING_DIFFERENCE, label: 'Timing Difference' },
  { value: ClassificationType.MISSING_TRANSACTION, label: 'Missing Transaction' },
  { value: ClassificationType.BANK_ERROR, label: 'Bank Error' },
  { value: ClassificationType.SYSTEM_ERROR, label: 'System Error' },
  { value: ClassificationType.MANUAL_OVERRIDE, label: 'Manual Override' },
];

export default function ClassificationDropdown({
  value,
  onChange,
  disabled = false,
  isLoading = false,
}: ClassificationDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as ClassificationType;
    if (newValue) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || isLoading}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500
          disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
        `}
      >
        <option value="">Select classification...</option>
        {classifications.map((classification) => (
          <option key={classification.value} value={classification.value}>
            {classification.label}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
