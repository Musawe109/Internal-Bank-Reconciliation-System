/**
 * Container for summary cards grid.
 */

import SummaryCard from './SummaryCard';
import type { ReconciliationSummary } from '@/lib/types/reconciliation';

interface SummaryCardsProps {
  summary: ReconciliationSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Items',
      value: summary.total,
      color: 'blue' as const,
    },
    {
      title: 'Matched',
      value: summary.matched,
      color: 'green' as const,
    },
    {
      title: 'Unmatched',
      value: summary.unmatched,
      color: 'red' as const,
    },
    {
      title: 'Pending',
      value: summary.pending,
      color: 'yellow' as const,
    },
    {
      title: 'Flagged',
      value: summary.flagged,
      color: 'purple' as const,
    },
    {
      title: 'Resolved',
      value: summary.resolved,
      color: 'green' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          color={card.color}
        />
      ))}
    </div>
  );
}
