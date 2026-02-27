/**
 * Audit log page - View audit trail of all reconciliation activities.
 * Full implementation with filtering, pagination, and expandable event details.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import AuditTable from '@/components/audit/table/AuditTable';
import AuditFilters from '@/components/audit/filters/AuditFilters';
import TablePagination from '@/components/ui/table/TablePagination';
import { AuditEventType } from '@/lib/enums/audit-event-type';
import type { AuditEvent } from '@/lib/types/audit';

// Mock data - will be replaced with API calls
const mockEvents: AuditEvent[] = [
  {
    id: 'audit-1',
    timestamp: new Date('2024-01-15T10:30:00').toISOString(),
    eventType: AuditEventType.UPLOAD,
    userId: 'user-1',
    userName: 'John Doe',
    itemId: null,
    description: 'Uploaded bank statement: bank_statement_jan_2024.csv',
    metadata: {
      before: {},
      after: { filename: 'bank_statement_jan_2024.csv', recordCount: 1250 },
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 'audit-2',
    timestamp: new Date('2024-01-15T11:00:00').toISOString(),
    eventType: AuditEventType.CLASSIFICATION,
    userId: 'user-1',
    userName: 'John Doe',
    itemId: 'item-42',
    description: 'Classified item-42 as Timing Difference',
    metadata: {
      before: { classification: null },
      after: { classification: 'Timing Difference' },
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 'audit-3',
    timestamp: new Date('2024-01-15T11:30:00').toISOString(),
    eventType: AuditEventType.WORKFLOW_ACTION,
    userId: 'user-2',
    userName: 'Jane Smith',
    itemId: 'item-15',
    description: 'Marked item-15 as resolved',
    metadata: {
      before: { status: 'unmatched' },
      after: { status: 'resolved' },
    },
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    id: 'audit-4',
    timestamp: new Date('2024-01-15T12:00:00').toISOString(),
    eventType: AuditEventType.OVERRIDE,
    userId: 'user-3',
    userName: 'Admin User',
    itemId: 'item-88',
    description: 'Applied manual override to item-88',
    metadata: {
      before: { status: 'unmatched', classification: null },
      after: { status: 'resolved', classification: 'Manual Override' },
      reason: 'Customer request - verified via phone',
      overrideCode: 'OVR-2024-001',
    },
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 'audit-5',
    timestamp: new Date('2024-01-15T12:30:00').toISOString(),
    eventType: AuditEventType.LOGIN,
    userId: 'user-1',
    userName: 'John Doe',
    itemId: null,
    description: 'User logged in',
    metadata: {},
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
];

interface AuditFiltersState {
  eventType?: AuditEventType;
  userId?: string;
  itemId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function AuditPage() {
  const [events] = useState<AuditEvent[]>(mockEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<AuditFiltersState>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.eventType && event.eventType !== filters.eventType) return false;
      if (filters.userId && !event.userId.includes(filters.userId)) return false;
      if (filters.itemId && event.itemId !== filters.itemId) return false;
      if (filters.dateFrom && event.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && event.timestamp > filters.dateTo) return false;
      return true;
    });
  }, [events, filters]);

  // Sort by timestamp (newest first)
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filteredEvents]);

  // Paginate
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedEvents.slice(start, end);
  }, [sortedEvents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEvents.length / pageSize);

  const handleFilterChange = useCallback((newFilters: AuditFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleExpand = useCallback((event: AuditEvent) => {
    setExpandedId(expandedId === event.id ? null : event.id);
  }, [expandedId]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredEvents.length.toLocaleString()} events found
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Immutable audit trail</div>
          <div>All user actions are logged</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Audit Log Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>All user actions are automatically logged</li>
                <li>Entries cannot be modified or deleted</li>
                <li>Retention period: 7 years for compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AuditFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <div className="rounded-lg bg-white shadow">
        {paginatedEvents.length > 0 ? (
          <>
            <AuditTable
              events={paginatedEvents}
              onExpand={handleExpand}
              expandedId={expandedId}
            />
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEvents.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
