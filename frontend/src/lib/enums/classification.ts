/**
 * Classification type enumeration for reconciliation discrepancies.
 * All classifications must use this enum - no hardcoded strings.
 */
export enum ClassificationType {
  TIMING_DIFFERENCE = 'Timing Difference',
  MISSING_TRANSACTION = 'Missing Transaction',
  BANK_ERROR = 'Bank Error',
  SYSTEM_ERROR = 'System Error',
  MANUAL_OVERRIDE = 'Manual Override',
}

/**
 * Get display label for classification type
 */
export function getClassificationLabel(type: ClassificationType): string {
  return type;
}

/**
 * Get CSS color class for classification badge
 */
export function getClassificationColor(type: ClassificationType): string {
  const colors: Record<ClassificationType, string> = {
    [ClassificationType.TIMING_DIFFERENCE]: 'bg-blue-100 text-blue-800',
    [ClassificationType.MISSING_TRANSACTION]: 'bg-purple-100 text-purple-800',
    [ClassificationType.BANK_ERROR]: 'bg-orange-100 text-orange-800',
    [ClassificationType.SYSTEM_ERROR]: 'bg-gray-100 text-gray-800',
    [ClassificationType.MANUAL_OVERRIDE]: 'bg-indigo-100 text-indigo-800',
  };
  return colors[type];
}
