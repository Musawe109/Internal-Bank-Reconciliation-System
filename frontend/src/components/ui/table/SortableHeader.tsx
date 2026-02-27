/**
 * Sortable table header component.
 */

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort?: { field: string; order: 'asc' | 'desc' };
  onSort: (field: string) => void;
  className?: string;
}

export default function SortableHeader({ label, field, currentSort, onSort, className = '' }: SortableHeaderProps) {
  const isActive = currentSort?.field === field;
  const order = currentSort?.order || 'desc';

  const handleClick = () => {
    onSort(field);
  };

  return (
    <th
      className={`cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {isActive && (
          <svg
            className={`h-4 w-4 transition-transform ${order === 'asc' ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </th>
  );
}
