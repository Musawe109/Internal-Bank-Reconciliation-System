/**
 * Workflow action enumeration for reconciliation item actions.
 */
export enum WorkflowAction {
  MARK_RESOLVED = 'markResolved',
  FLAG_FOR_REVIEW = 'flagForReview',
  APPLY_OVERRIDE = 'applyOverride',
  REVERT = 'revert',
}
