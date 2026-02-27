/**
 * Summary card for displaying reconciliation statistics.
 */

interface SummaryCardProps {
  title: string;
  value: number;
  trend?: number;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

export default function SummaryCard({ title, value, trend, color }: SummaryCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`h-12 w-12 rounded-full ${colorClasses[color]}`} />
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="ml-2 text-sm text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
