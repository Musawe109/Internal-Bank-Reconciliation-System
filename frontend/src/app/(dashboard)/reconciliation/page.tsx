/**
 * Reconciliation list page - View and manage reconciliation items.
 * Full implementation with pagination, filters, sorting, and classification.
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StatusBadge from '@/components/ui/status-badge/StatusBadge';
import ClassificationBadge from '@/components/ui/classification-badge/ClassificationBadge';
import SortableHeader from '@/components/ui/table/SortableHeader';
import TablePagination from '@/components/ui/table/TablePagination';
import FilterControls from '@/components/reconciliation/filters/FilterControls';
import ClassificationDropdown from '@/components/reconciliation/classification/ClassificationDropdown';
import { WorkflowState } from '@/lib/enums/workflow-state';
import { ClassificationType } from '@/lib/enums/classification';
import type { ReconciliationItem } from '@/lib/types/reconciliation';

// Mock data - will be replaced with API calls
const mockItems: ReconciliationItem[] = Array.from({ length: 150 }, (_, i) => ({
  id: `item-${i + 1}`,
  transactionDate: new Date(2024, 0, Math.floor(Math.random() * 31) + 1).toISOString(),
  amount: Math.floor(Math.random() * 10000) + 100,
  currency: 'USD',
  description: `Transaction ${i + 1} - Payment for services`,
  status: Object.values(WorkflowState)[Math.floor(Math.random() * 5)],
  classification: Math.random() > 0.3 ? Object.values(ClassificationType)[Math.floor(Math.random() * 5)] : null,
  bankTransactionId: `bank-${i + 1}`,
  internalTransactionId: `internal-${i + 1}`,
  variance: Math.floor(Math.random() * 1000) - 500,
  createdAt: new Date(2024, 0, 1).toISOString(),
  updatedAt: new Date(2024, 0, 15).toISOString(),
  updatedBy: 'user-1',
}));

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

interface ReconciliationFilters {
  status?: WorkflowState;
  classification?: ClassificationType;
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
  search?: string;
}

export default function ReconciliationPage() {
  const searchParams = useSearchParams();
  const [items] = useState<ReconciliationItem[]>(mockItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sort, setSort] = useState<SortConfig>({ field: 'transactionDate', order: 'desc' });
  const [filters, setFilters] = useState<ReconciliationFilters>({});
  const [classifyingId, setClassifyingId] = useState<string | null>(null);

  // Apply filters from URL query parameters on mount
  useEffect(() => {
    const classificationParam = searchParams.get('classification');
    const statusParam = searchParams.get('status');

    const newFilters: ReconciliationFilters = {};

    if (classificationParam) {
      // Map classification parameter to enum value
      const classificationValue = Object.values(ClassificationType).find(
        (c) => c.toLowerCase() === classificationParam.toLowerCase().replace(/_/g, ' ')
      );
      if (classificationValue) {
        newFilters.classification = classificationValue;
      }
    }

    if (statusParam) {
      // Map status parameter to enum value
      const statusMap: Record<string, WorkflowState> = {
        'pending_approval': WorkflowState.PENDING,
        'pending': WorkflowState.PENDING,
        'flagged': WorkflowState.FLAGGED,
        'matched': WorkflowState.MATCHED,
        'unmatched': WorkflowState.UNMATCHED,
        'resolved': WorkflowState.RESOLVED,
      };
      const statusValue = statusMap[statusParam.toLowerCase()];
      if (statusValue) {
        newFilters.status = statusValue;
      }
    }

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
  }, [searchParams]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.classification && item.classification !== filters.classification) return false;
      if (filters.dateFrom && item.transactionDate < filters.dateFrom) return false;
      if (filters.dateTo && item.transactionDate > filters.dateTo) return false;
      if (filters.amountFrom && item.amount < filters.amountFrom) return false;
      if (filters.amountTo && item.amount > filters.amountTo) return false;
      if (filters.search && !item.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [items, filters]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aValue = a[sort.field as keyof ReconciliationItem];
      const bValue = b[sort.field as keyof ReconciliationItem];

      if (aValue === null || bValue === null) return 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [filteredItems, sort]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedItems.slice(start, end);
  }, [sortedItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handleSort = useCallback((field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters: ReconciliationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleClassificationChange = useCallback((itemId: string, _classification: ClassificationType) => {
    setClassifyingId(itemId);
    // Simulate API call
    setTimeout(() => {
      setClassifyingId(null);
    }, 500);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reconciliation Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredItems.length.toLocaleString()} items found
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterControls
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <div className="rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader
                  label="Date"
                  field="transactionDate"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Description"
                  field="description"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Amount"
                  field="amount"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Variance"
                  field="variance"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatDate(item.transactionDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">{item.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={item.variance !== 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                      {formatCurrency(item.variance)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <ClassificationBadge classification={item.classification} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <ClassificationDropdown
                      value={item.classification}
                      onChange={(classification) => handleClassificationChange(item.id, classification)}
                      disabled={classifyingId === item.id}
                      isLoading={classifyingId === item.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
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
