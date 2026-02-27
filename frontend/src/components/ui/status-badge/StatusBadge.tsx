/**
 * Status badge component for displaying workflow states.
 */

import { getWorkflowStateLabel, getWorkflowStateColor } from '@/lib/enums/workflow-state';
import type { WorkflowState } from '@/lib/enums/workflow-state';

interface StatusBadgeProps {
  status: WorkflowState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const label = getWorkflowStateLabel(status);
  const colorClass = getWorkflowStateColor(status);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClasses[size]} ${className}`}>
      {label}
    </span>
  );
}
