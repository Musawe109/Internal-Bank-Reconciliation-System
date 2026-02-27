/**
 * Audit log filters component.
 */

import { AuditEventType } from '@/lib/enums/audit-event-type';

interface AuditFilters {
  eventType?: AuditEventType;
  userId?: string;
  itemId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface AuditFiltersProps {
  filters: AuditFilters;
  onFilterChange: (filters: AuditFilters) => void;
  onClearFilters: () => void;
}

export default function AuditFilters({ filters, onFilterChange, onClearFilters }: AuditFiltersProps) {
  const hasActiveFilters =
    filters.eventType ||
    filters.userId ||
    filters.itemId ||
    filters.dateFrom ||
    filters.dateTo;

  const updateFilter = <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) => {
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Type</label>
          <select
            value={filters.eventType || ''}
            onChange={(e) => updateFilter('eventType', (e.target.value || undefined) as AuditEventType | undefined)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value={AuditEventType.UPLOAD}>Upload</option>
            <option value={AuditEventType.CLASSIFICATION}>Classification</option>
            <option value={AuditEventType.WORKFLOW_ACTION}>Workflow Action</option>
            <option value={AuditEventType.OVERRIDE}>Override</option>
            <option value={AuditEventType.LOGIN}>Login</option>
            <option value={AuditEventType.LOGOUT}>Logout</option>
          </select>
        </div>

        {/* User Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="text"
            value={filters.userId || ''}
            onChange={(e) => updateFilter('userId', e.target.value || undefined)}
            placeholder="Search by user..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        {/* Item ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Item ID</label>
          <input
            type="text"
            value={filters.itemId || ''}
            onChange={(e) => updateFilter('itemId', e.target.value || undefined)}
            placeholder="Search by item..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="mt-4 grid grid-cols-2 gap-4">
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
  );
}
