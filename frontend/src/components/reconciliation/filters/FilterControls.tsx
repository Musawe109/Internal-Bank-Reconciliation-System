/**
 * Filter controls for reconciliation table.
 */

import { WorkflowState } from '@/lib/enums/workflow-state';
import { ClassificationType } from '@/lib/enums/classification';

interface ReconciliationFilters {
  status?: WorkflowState;
  classification?: ClassificationType;
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
  search?: string;
}

interface FilterControlsProps {
  filters: ReconciliationFilters;
  onFilterChange: (filters: ReconciliationFilters) => void;
  onClearFilters: () => void;
}

export default function FilterControls({ filters, onFilterChange, onClearFilters }: FilterControlsProps) {
  const hasActiveFilters =
    filters.status ||
    filters.classification ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountFrom !== undefined ||
    filters.amountTo !== undefined ||
    filters.search;

  const updateFilter = <K extends keyof ReconciliationFilters>(key: K, value: ReconciliationFilters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            placeholder="Search description..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', (e.target.value || undefined) as WorkflowState | undefined)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value={WorkflowState.MATCHED}>Matched</option>
            <option value={WorkflowState.UNMATCHED}>Unmatched</option>
            <option value={WorkflowState.PENDING}>Pending</option>
            <option value={WorkflowState.FLAGGED}>Flagged</option>
            <option value={WorkflowState.RESOLVED}>Resolved</option>
          </select>
        </div>

        {/* Classification Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Classification</label>
          <select
            value={filters.classification || ''}
            onChange={(e) => updateFilter('classification', (e.target.value || undefined) as ClassificationType | undefined)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">All Classifications</option>
            <option value={ClassificationType.TIMING_DIFFERENCE}>Timing Difference</option>
            <option value={ClassificationType.MISSING_TRANSACTION}>Missing Transaction</option>
            <option value={ClassificationType.BANK_ERROR}>Bank Error</option>
            <option value={ClassificationType.SYSTEM_ERROR}>System Error</option>
            <option value={ClassificationType.MANUAL_OVERRIDE}>Manual Override</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Amount Range */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Amount</label>
          <input
            type="number"
            value={filters.amountFrom || ''}
            onChange={(e) => updateFilter('amountFrom', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Amount</label>
          <input
            type="number"
            value={filters.amountTo || ''}
            onChange={(e) => updateFilter('amountTo', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="1000000"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
              Status: {filters.status}
              <button
                onClick={() => updateFilter('status', undefined)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          )}
          {filters.classification && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
              Classification: {filters.classification}
              <button
                onClick={() => updateFilter('classification', undefined)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
              Date: {filters.dateFrom || 'Start'} - {filters.dateTo || 'End'}
              <button
                onClick={() => {
                  updateFilter('dateFrom', undefined);
                  updateFilter('dateTo', undefined);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
