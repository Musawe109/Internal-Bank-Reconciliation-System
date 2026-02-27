/**
 * Action buttons for reconciliation items.
 */

import { WorkflowAction } from '@/lib/enums/workflow-action';
import { WorkflowState } from '@/lib/enums/workflow-state';

interface ActionButtonsProps {
  status: WorkflowState;
  onAction: (action: WorkflowAction) => void;
  disabled?: boolean;
}

export default function ActionButtons({ status, onAction, disabled = false }: ActionButtonsProps) {
  // Determine which actions are available based on current status
  const getAvailableActions = () => {
    switch (status) {
      case WorkflowState.UNMATCHED:
        return [
          { action: WorkflowAction.MARK_RESOLVED, label: 'Mark Resolved', variant: 'primary' },
          { action: WorkflowAction.FLAG_FOR_REVIEW, label: 'Flag for Review', variant: 'secondary' },
          { action: WorkflowAction.APPLY_OVERRIDE, label: 'Manual Override', variant: 'secondary' },
        ];
      case WorkflowState.PENDING:
        return [
          { action: WorkflowAction.MARK_RESOLVED, label: 'Mark Resolved', variant: 'primary' },
          { action: WorkflowAction.FLAG_FOR_REVIEW, label: 'Flag for Review', variant: 'secondary' },
          { action: WorkflowAction.REVERT, label: 'Revert', variant: 'danger' },
        ];
      case WorkflowState.FLAGGED:
        return [
          { action: WorkflowAction.MARK_RESOLVED, label: 'Mark Resolved', variant: 'primary' },
          { action: WorkflowAction.REVERT, label: 'Unflag', variant: 'secondary' },
        ];
      case WorkflowState.RESOLVED:
        return [
          { action: WorkflowAction.REVERT, label: 'Revert', variant: 'secondary' },
        ];
      case WorkflowState.MATCHED:
        return [];
      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No actions available
      </div>
    );
  }

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gray-900 text-white hover:bg-gray-800';
      case 'secondary':
        return 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      default:
        return 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.action}
          onClick={() => onAction(action.action)}
          disabled={disabled}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${getButtonStyles(action.variant)}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
