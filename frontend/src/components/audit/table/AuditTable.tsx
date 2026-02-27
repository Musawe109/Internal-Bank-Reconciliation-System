/**
 * Audit log table component with pagination.
 */

import type { AuditEvent } from '@/lib/types/audit';
import { getAuditEventLabel } from '@/lib/enums/audit-event-type';
import type { AuditEventType } from '@/lib/enums/audit-event-type';

interface AuditTableProps {
  events: AuditEvent[];
  onExpand?: (event: AuditEvent) => void;
  expandedId?: string | null;
}

export default function AuditTable({ events, onExpand, expandedId }: AuditTableProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatEventType = (eventType: string) => {
    try {
      return getAuditEventLabel(eventType as AuditEventType) || eventType;
    } catch {
      return eventType;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Event Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Item ID
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {events.map((event) => {
            const isExpanded = expandedId === event.id;

            return (
              <tr
                key={event.id}
                className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {formatDateTime(event.timestamp)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {formatEventType(event.eventType)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{event.userName}</div>
                    <div className="text-xs text-gray-500">{event.userId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-md truncate">{event.description}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {event.itemId || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => onExpand?.(event)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
