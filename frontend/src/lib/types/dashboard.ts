/**
 * Domain types for dashboard feature.
 */

import type { ReconciliationSummary } from './reconciliation';

/**
 * Dashboard data response.
 */
export interface DashboardData {
  summary: ReconciliationSummary;
  recentActivity: ActivityItem[];
  quickStats: QuickStats;
}

/**
 * Activity item for dashboard feed.
 */
export interface ActivityItem {
  id: string;
  type: 'upload' | 'classification' | 'workflow_action';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

/**
 * Quick statistics for dashboard.
 */
export interface QuickStats {
  uploadsToday: number;
  pendingReview: number;
  avgProcessingTime: number;
}
