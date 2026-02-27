/**
 * Dashboard page - Main landing page for reconciliation officers.
 * Displays summary cards and provides navigation to other sections.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SummaryCards from '@/components/dashboard/summary-cards/SummaryCards';
import type { ReconciliationSummary } from '@/lib/types/reconciliation';

// Mock data - will be replaced with API calls
const mockSummary: ReconciliationSummary = {
  total: 1250,
  matched: 890,
  unmatched: 180,
  pending: 95,
  flagged: 45,
  resolved: 40,
  totalVariance: 15420.5,
  lastUpdated: new Date().toISOString(),
};

export default function DashboardPage() {
  const router = useRouter();
  const [summary] = useState<ReconciliationSummary>(mockSummary);
  const [formattedTime, setFormattedTime] = useState('');

  // ✅ Fix hydration mismatch (client-only time formatting)
  useEffect(() => {
    if (summary?.lastUpdated) {
      setFormattedTime(
        new Date(summary.lastUpdated).toLocaleString()
      );
    }
  }, [summary.lastUpdated]);

  const handleUploadCSV = () => {
    router.push('/upload');
  };

  const handleViewUnmatched = () => {
    // Navigate to reconciliation page with unmatched status filter
    const params = new URLSearchParams({
      status: 'unmatched',
    });
    router.push(`/reconciliation?${params.toString()}`);
  };

  const handleReviewFlagged = () => {
    // Navigate to reconciliation page with flagged items filter
    const params = new URLSearchParams({
      status: 'flagged',
    });
    router.push(`/reconciliation?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of reconciliation status
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {formattedTime}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={handleUploadCSV}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload CSV File
          </button>

          <button
            onClick={handleViewUnmatched}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View Unmatched Items
          </button>

          <button
            onClick={handleReviewFlagged}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Review Flagged Items
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Activity
        </h2>

        <div className="mt-4 text-sm text-gray-500">
          Activity feed will be displayed here
        </div>
      </div>
    </div>
  );
}
