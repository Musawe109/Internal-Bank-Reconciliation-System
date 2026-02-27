/**
 * Domain types for audit feature.
 */

import type { AuditEventType } from '@/lib/enums/audit-event-type';

/**
 * AuditEvent represents a single audit log entry.
 */
export interface AuditEvent {
  id: string;
  timestamp: string; // ISO 8601 format
  eventType: AuditEventType;
  userId: string;
  userName: string;
  itemId: string | null;
  description: string;
  metadata: AuditEventMetadata;
  ipAddress: string;
  userAgent: string;
}

/**
 * Audit event metadata.
 */
export interface AuditEventMetadata {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  overrideCode?: string;
}

/**
 * Audit event detail with expanded data.
 */
export interface AuditEventDetail extends AuditEvent {
  fullMetadata: Record<string, unknown>;
  relatedEvents: AuditEvent[];
}

/**
 * Audit log query parameters.
 */
export interface AuditFilters {
  eventType?: AuditEventType;
  userId?: string;
  itemId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
