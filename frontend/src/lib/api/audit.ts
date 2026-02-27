/**
 * API service for audit log operations.
 * Centralizes all audit-related API calls.
 */

import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { AuditEvent, AuditEventDetail } from '@/lib/types/audit';
import type { PaginatedResponse } from '@/lib/api/types';
import type { AuditEventType } from '@/lib/enums/audit-event-type';

export interface AuditFilters {
  eventType?: AuditEventType;
  userId?: string;
  itemId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Fetch paginated audit events
 */
export async function getAuditEvents(
  filters: AuditFilters
): Promise<PaginatedResponse<AuditEvent>> {
  const params: Record<string, string> = {};

  if (filters.eventType) params.eventType = filters.eventType;
  if (filters.userId) params.userId = filters.userId;
  if (filters.itemId) params.itemId = filters.itemId;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.page) params.page = filters.page.toString();
  if (filters.pageSize) params.pageSize = filters.pageSize.toString();

  const response = await apiClient.get<PaginatedResponse<AuditEvent>>(
    endpoints.audit.list(params)
  );
  return response;
}

/**
 * Fetch single audit event detail
 */
export async function getAuditEventDetail(id: string): Promise<AuditEventDetail> {
  const response = await apiClient.get<ApiResponse<AuditEventDetail>>(
    endpoints.audit.detail(id)
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
  };
};
