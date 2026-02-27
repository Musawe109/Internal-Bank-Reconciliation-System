/**
 * API Type Contracts for Internal Bank Reconciliation System
 * 
 * This file contains TypeScript interfaces that mirror the OpenAPI specification.
 * These types are used by the frontend for API communication and type safety.
 * 
 * Generated from: contracts/openapi.yaml
 * Last updated: 2026-02-22
 */

// ============================================================================
// Domain Models
// ============================================================================

/**
 * User role with permission levels
 */
export type UserRole = 'viewer' | 'processor' | 'approver' | 'admin';

/**
 * System user with role-based access
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reconciliation session status
 */
export type ReconciliationStatus = 
  | 'draft' 
  | 'processing' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected';

/**
 * Transaction classification result
 */
export type TransactionClassification = 
  | 'matched' 
  | 'unmatched_bank_only' 
  | 'unmatched_internal_only' 
  | 'variance_detected';

/**
 * Reconciliation session representing a single bank CSV upload
 */
export interface ReconciliationSession {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  totalBankTransactions: number;
  totalInternalTransactions: number;
  matchedCount: number;
  unmatchedBankOnlyCount: number;
  unmatchedInternalOnlyCount: number;
  varianceDetectedCount: number;
  status: ReconciliationStatus;
  submittedAt?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;
  processingStartedAt?: string | null;
  processingCompletedAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Bank transaction from uploaded CSV file
 */
export interface BankTransaction {
  id: string;
  reconciliationSessionId: string;
  amount: number;
  currency: string;
  transactionDate: string;
  valueDate?: string | null;
  reference: string;
  description: string;
  counterpartyName?: string | null;
  counterpartyAccount?: string | null;
  classification: TransactionClassification;
  matchedInternalTransactionId?: string | null;
  varianceAmount?: number | null;
  overrideReason?: string | null;
  overriddenAt?: string | null;
  overriddenBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Internal transaction from Oracle financial system
 */
export interface InternalTransaction {
  id: string;
  reconciliationSessionId?: string | null;
  amount: number;
  currency: string;
  transactionDate: string;
  reference: string;
  description: string;
  accountCode: string;
  costCenter: string;
  journalEntryId: string;
  lineNumber?: number | null;
  createdBy: string;
  createdAt: string;
  sourceSystem: 'ORACLE' | 'MANUAL' | 'INTEGRATION';
}

/**
 * Result of matching bank transaction with internal records
 */
export interface ReconciliationResult {
  id: string;
  reconciliationSessionId: string;
  bankTransactionId: string;
  classification: TransactionClassification;
  confidenceScore?: number | null;
  matchedInternalTransactionIds: string[];
  varianceAmount?: number | null;
  varianceReason?: string | null;
  isOverridden: boolean;
  previousClassification?: TransactionClassification | null;
  overrideReason?: string | null;
  overriddenAt?: string | null;
  overriddenBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Manual override record for classification changes
 */
export interface ManualOverride {
  id: string;
  reconciliationSessionId: string;
  bankTransactionId: string;
  previousClassification: TransactionClassification;
  newClassification: TransactionClassification;
  reason: string;
  supportingDocumentId?: string | null;
  userId: string;
  userEmail: string;
  approvalStatus: OverrideApprovalStatus;
  approvedAt?: string | null;
  approvedBy?: string | null;
  createdAt: string;
}

/**
 * Override approval status
 */
export type OverrideApprovalStatus = 'pending' | 'approved' | 'rejected';

/**
 * Audit action types
 */
export type AuditActionType = 
  | 'login'
  | 'logout'
  | 'file_upload'
  | 'reconciliation_create'
  | 'reconciliation_submit'
  | 'reconciliation_approve'
  | 'reconciliation_reject'
  | 'classification_override'
  | 'filter_apply'
  | 'export';

/**
 * Entity types for audit logging
 */
export type AuditEntityType = 
  | 'reconciliation'
  | 'transaction'
  | 'override'
  | 'workflow'
  | 'user'
  | 'auth';

/**
 * Immutable audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userName: string;
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
}

// ============================================================================
// API Response Wrappers
// ============================================================================

/**
 * Reconciliation summary statistics
 */
export interface ReconciliationSummary {
  totalTransactions: number;
  matchedPercentage: number;
  unmatchedPercentage: number;
  variancePercentage: number;
  totalVarianceAmount: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Create reconciliation request (file upload)
 */
export interface CreateReconciliationRequest {
  file: File;
}

/**
 * Submit reconciliation for approval
 */
export interface SubmitReconciliationRequest {
  id: string;
}

/**
 * Approve reconciliation
 */
export interface ApproveReconciliationRequest {
  id: string;
}

/**
 * Reject reconciliation with reason
 */
export interface RejectReconciliationRequest {
  id: string;
  reason: string;
}

/**
 * Override transaction classification
 */
export interface OverrideTransactionRequest {
  transactionId: string;
  classification: TransactionClassification;
  reason: string; // Minimum 10 characters
}

/**
 * List reconciliations filters
 */
export interface ListReconciliationsFilters {
  page?: number;
  pageSize?: number;
  status?: ReconciliationStatus[];
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Get transactions filters
 */
export interface GetTransactionsFilters {
  sessionId: string;
  page?: number;
  pageSize?: number;
  classification?: TransactionClassification[];
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Get audit logs filters
 */
export interface GetAuditLogsFilters {
  page?: number;
  pageSize?: number;
  actionType?: AuditActionType[];
  entityType?: AuditEntityType[];
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Login response
 */
export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  success: boolean;
}

/**
 * Get current user response
 */
export interface GetCurrentUserResponse {
  user: User;
}

/**
 * List reconciliations response
 */
export interface ListReconciliationsResponse {
  reconciliations: ReconciliationSession[];
  pagination: PaginationMeta;
}

/**
 * Create reconciliation response
 */
export interface CreateReconciliationResponse {
  session: ReconciliationSession;
}

/**
 * Get reconciliation response
 */
export interface GetReconciliationResponse {
  session: ReconciliationSession;
  summary: ReconciliationSummary;
}

/**
 * Submit/Approve/Reject reconciliation response
 */
export interface ReconciliationActionResponse {
  session: ReconciliationSession;
}

/**
 * Get transactions response
 */
export interface GetTransactionsResponse {
  transactions: BankTransaction[];
  pagination: PaginationMeta;
}

/**
 * Override transaction response
 */
export interface OverrideTransactionResponse {
  transaction: BankTransaction;
  override: ManualOverride;
}

/**
 * Get overrides response
 */
export interface GetOverridesResponse {
  overrides: ManualOverride[];
}

/**
 * Get audit logs response
 */
export interface GetAuditLogsResponse {
  logs: AuditLogEntry[];
  pagination: PaginationMeta;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Error codes
 */
export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Authorization
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Not Found
  NOT_FOUND = 'NOT_FOUND',
  RECONCILIATION_NOT_FOUND = 'RECONCILIATION_NOT_FOUND',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  
  // Conflict
  CONFLICT = 'CONFLICT',
  ALREADY_APPROVED = 'ALREADY_APPROVED',
  ALREADY_SUBMITTED = 'ALREADY_SUBMITTED',
  
  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Field-specific validation errors
 */
export interface FieldErrors {
  [field: string]: string[];
}

/**
 * API error response
 */
export interface ErrorResponse {
  error: {
    code: ErrorCode | string;
    message: string;
    details?: FieldErrors | null;
    stack?: string | null; // Development mode only
  };
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode | string,
    message: string,
    public details?: FieldErrors | null,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  isValidationError(): boolean {
    return this.code === ErrorCode.VALIDATION_ERROR;
  }

  isUnauthorized(): boolean {
    return this.code === ErrorCode.UNAUTHORIZED || 
           this.code === ErrorCode.TOKEN_EXPIRED ||
           this.status === 401;
  }

  isForbidden(): boolean {
    return this.code === ErrorCode.FORBIDDEN || 
           this.code === ErrorCode.INSUFFICIENT_PERMISSIONS ||
           this.status === 403;
  }

  isNotFound(): boolean {
    return this.code === ErrorCode.NOT_FOUND || this.status === 404;
  }
}

// ============================================================================
// Health Check
// ============================================================================

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
}

// ============================================================================
// Filter State (Frontend)
// ============================================================================

/**
 * Active filter state for UI
 */
export interface FilterState {
  classification?: TransactionClassification[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  status?: ReconciliationStatus[];
}

/**
 * Saved filter configuration
 */
export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for checking if response is an error
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ErrorResponse).error === 'object' &&
    (response as ErrorResponse).error !== null &&
    'code' in (response as ErrorResponse).error &&
    'message' in (response as ErrorResponse).error
  );
}

/**
 * Type guard for checking if classification is valid
 */
export function isValidClassification(
  value: string
): value is TransactionClassification {
  return [
    'matched',
    'unmatched_bank_only',
    'unmatched_internal_only',
    'variance_detected'
  ].includes(value);
}

/**
 * Type guard for checking if status is valid
 */
export function isValidStatus(value: string): value is ReconciliationStatus {
  return [
    'draft',
    'processing',
    'pending_approval',
    'approved',
    'rejected'
  ].includes(value);
}

/**
 * Type guard for checking if role is valid
 */
export function isValidRole(value: string): value is UserRole {
  return ['viewer', 'processor', 'approver', 'admin'].includes(value);
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make specific fields required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific fields optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract response type from API function
 */
export type ApiResponse<T> = Promise<T | ErrorResponse>;

/**
 * API function type
 */
export type ApiFunction<TRequest, TResponse> = (
  request: TRequest
) => Promise<TResponse | ErrorResponse>;
