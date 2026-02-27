/**
 * Workflow state enumeration for reconciliation items.
 * All workflow states must use this enum - no hardcoded strings.
 */
export enum WorkflowState {
  MATCHED = 'matched',
  UNMATCHED = 'unmatched',
  PENDING = 'pending',
  FLAGGED = 'flagged',
  RESOLVED = 'resolved',
}

/**
 * Get display label for workflow state
 */
export function getWorkflowStateLabel(state: WorkflowState): string {
  const labels: Record<WorkflowState, string> = {
    [WorkflowState.MATCHED]: 'Matched',
    [WorkflowState.UNMATCHED]: 'Unmatched',
    [WorkflowState.PENDING]: 'Pending',
    [WorkflowState.FLAGGED]: 'Flagged',
    [WorkflowState.RESOLVED]: 'Resolved',
  };
  return labels[state];
}

/**
 * Get CSS color class for workflow state badge
 */
export function getWorkflowStateColor(state: WorkflowState): string {
  const colors: Record<WorkflowState, string> = {
    [WorkflowState.MATCHED]: 'bg-green-100 text-green-800',
    [WorkflowState.UNMATCHED]: 'bg-red-100 text-red-800',
    [WorkflowState.PENDING]: 'bg-yellow-100 text-yellow-800',
    [WorkflowState.FLAGGED]: 'bg-red-200 text-red-900',
    [WorkflowState.RESOLVED]: 'bg-green-200 text-green-900',
  };
  return colors[state];
}
