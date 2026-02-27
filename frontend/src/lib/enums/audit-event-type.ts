/**
 * Audit event type enumeration.
 */
export enum AuditEventType {
  UPLOAD = 'upload',
  CLASSIFICATION = 'classification',
  WORKFLOW_ACTION = 'workflow_action',
  OVERRIDE = 'override',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

/**
 * Get display label for audit event type
 */
export function getAuditEventLabel(type: AuditEventType): string {
  const labels: Record<AuditEventType, string> = {
    [AuditEventType.UPLOAD]: 'File Upload',
    [AuditEventType.CLASSIFICATION]: 'Classification',
    [AuditEventType.WORKFLOW_ACTION]: 'Workflow Action',
    [AuditEventType.OVERRIDE]: 'Manual Override',
    [AuditEventType.LOGIN]: 'Login',
    [AuditEventType.LOGOUT]: 'Logout',
  };
  return labels[type];
}
