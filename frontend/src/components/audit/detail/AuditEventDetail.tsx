/**
 * Audit event detail component for expanded view.
 */

import type { AuditEvent } from '@/lib/types/audit';

interface AuditEventDetailProps {
  event: AuditEvent;
}

export default function AuditEventDetail({ event }: AuditEventDetailProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <td colSpan={6} className="bg-blue-50 px-6 py-4">
      <div className="space-y-4">
        {/* Event Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Event ID</h4>
            <p className="mt-1 text-sm text-gray-900">{event.id}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Timestamp</h4>
            <p className="mt-1 text-sm text-gray-900">{formatDateTime(event.timestamp)}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">User</h4>
            <p className="mt-1 text-sm text-gray-900">{event.userName} ({event.userId})</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">IP Address</h4>
            <p className="mt-1 text-sm text-gray-900">{event.ipAddress}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-medium text-gray-700">Description</h4>
          <p className="mt-1 text-sm text-gray-900">{event.description}</p>
        </div>

        {/* Metadata - Before/After */}
        {(event.metadata.before || event.metadata.after) && (
          <div className="grid grid-cols-2 gap-4">
            {event.metadata.before && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Before</h4>
                <pre className="mt-1 max-h-48 overflow-auto rounded-md bg-gray-100 p-3 text-xs text-gray-800">
                  {formatValue(event.metadata.before)}
                </pre>
              </div>
            )}
            {event.metadata.after && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">After</h4>
                <pre className="mt-1 max-h-48 overflow-auto rounded-md bg-gray-100 p-3 text-xs text-gray-800">
                  {formatValue(event.metadata.after)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Additional Metadata */}
        {(event.metadata.reason || event.metadata.overrideCode) && (
          <div className="grid grid-cols-2 gap-4">
            {event.metadata.reason && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Reason</h4>
                <p className="mt-1 text-sm text-gray-900">{event.metadata.reason}</p>
              </div>
            )}
            {event.metadata.overrideCode && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Override Code</h4>
                <p className="mt-1 text-sm text-gray-900">{event.metadata.overrideCode}</p>
              </div>
            )}
          </div>
        )}

        {/* User Agent */}
        <div>
          <h4 className="text-sm font-medium text-gray-700">User Agent</h4>
          <p className="mt-1 text-xs text-gray-500">{event.userAgent}</p>
        </div>
      </div>
    </td>
  );
}
