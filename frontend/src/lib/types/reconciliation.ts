/**
 * Domain types for reconciliation feature.
 */

import type { WorkflowState } from '@/lib/enums/workflow-state';
import type { ClassificationType } from '@/lib/enums/classification';
import type { AuditEvent } from '@/lib/types/audit';

/**
 * ReconciliationItem represents a single reconciliation record.
 */
export interface ReconciliationItem {
  id: string;
  transactionDate: string; // ISO 8601 format
  amount: number;
  currency: string; // ISO 4217
  description: string;
  status: WorkflowState;
  classification: ClassificationType | null;
  bankTransactionId: string;
  internalTransactionId: string;
  variance: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  updatedBy: string;
}

/**
 * ReconciliationSummary for dashboard summary cards.
 */
export interface ReconciliationSummary {
  total: number;
  matched: number;
  unmatched: number;
  pending: number;
  flagged: number;
  resolved: number;
  totalVariance: number;
  lastUpdated: string; // ISO 8601 format
}

/**
 * Bank transaction details.
 */
export interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  reference: string;
  accountNumber: string;
}

/**
 * Internal transaction details.
 */
export interface InternalTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  reference: string;
  accountCode: string;
  category: string;
}

/**
 * Reconciliation item detail with related data.
 */
export interface ReconciliationItemDetail extends ReconciliationItem {
  bankTransaction: BankTransaction;
  internalTransaction: InternalTransaction;
  auditTrail: AuditEvent[];
  attachments: Attachment[];
}

/**
 * Attachment for reconciliation item.
 */
export interface Attachment {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}
