/**
 * Classification badge component for displaying classification types.
 */

import { getClassificationLabel, getClassificationColor } from '@/lib/enums/classification';
import type { ClassificationType } from '@/lib/enums/classification';

interface ClassificationBadgeProps {
  classification: ClassificationType | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ClassificationBadge({ classification, size = 'md', className = '' }: ClassificationBadgeProps) {
  if (!classification) {
    return (
      <span className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 ${className}`}>
        Unclassified
      </span>
    );
  }

  const label = getClassificationLabel(classification);
  const colorClass = getClassificationColor(classification);
  
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
