/**
 * API service for reconciliation operations.
 * Centralizes all API calls with proper typing.
 */

import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { ReconciliationItem, ReconciliationSummary, ReconciliationItemDetail } from '@/lib/types/reconciliation';
import type { PaginatedResponse } from '@/lib/api/types';
import type { WorkflowAction } from '@/lib/enums/workflow-action';
import type { ClassificationType } from '@/lib/enums/classification';

export interface ReconciliationFilters {
  status?: string;
  classification?: string;
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch reconciliation summary for dashboard
 */
export async function getReconciliationSummary(): Promise<ReconciliationSummary> {
  const response = await apiClient.get<ApiResponse<ReconciliationSummary>>(endpoints.dashboard.summary());
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

/**
 * Fetch paginated reconciliation items
 */
export async function getReconciliationItems(
  filters: ReconciliationFilters
): Promise<PaginatedResponse<ReconciliationItem>> {
  const params: Record<string, string> = {};
  
  if (filters.status) params.status = filters.status;
  if (filters.classification) params.classification = filters.classification;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.amountFrom) params.amountFrom = filters.amountFrom.toString();
  if (filters.amountTo) params.amountTo = filters.amountTo.toString();
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page.toString();
  if (filters.pageSize) params.pageSize = filters.pageSize.toString();
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const response = await apiClient.get<PaginatedResponse<ReconciliationItem>>(
    endpoints.reconciliation.list(params)
  );
  return response;
}

/**
 * Fetch single reconciliation item detail
 */
export async function getReconciliationItem(id: string): Promise<ReconciliationItemDetail> {
  const response = await apiClient.get<ApiResponse<ReconciliationItemDetail>>(
    endpoints.reconciliation.detail(id)
  );
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

/**
 * Update classification for an item
 */
export async function updateClassification(
  id: string,
  classification: ClassificationType,
  reason?: string
): Promise<ReconciliationItem> {
  const response = await apiClient.put<ApiResponse<ReconciliationItem>>(
    endpoints.reconciliation.classification(id),
    { classification, reason }
  );
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

/**
 * Perform workflow action on an item
 */
export async function performWorkflowAction(
  id: string,
  action: WorkflowAction,
  data?: { reason?: string; overrideCode?: string }
): Promise<ReconciliationItem> {
  const response = await apiClient.post<ApiResponse<ReconciliationItem>>(
    endpoints.reconciliation.actions(id),
    { action, ...data }
  );
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};
