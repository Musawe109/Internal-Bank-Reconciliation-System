/**
 * API endpoint definitions.
 * All endpoints are centralized here for easy maintenance.
 */

export const endpoints = {
  // Dashboard
  dashboard: {
    summary: () => '/api/dashboard/summary',
  },

  // Reconciliation
  reconciliation: {
    list: (params?: Record<string, string>) => {
      const base = '/api/reconciliation/items';
      if (!params) return base;
      const queryString = new URLSearchParams(params).toString();
      return `${base}?${queryString}`;
    },
    detail: (id: string) => `/api/reconciliation/items/${id}`,
    classification: (id: string) => `/api/reconciliation/items/${id}/classification`,
    actions: (id: string) => `/api/reconciliation/items/${id}/actions`,
  },

  // Upload
  uploads: {
    csv: () => '/api/uploads/csv',
    status: (uploadId: string) => `/api/uploads/${uploadId}/status`,
    history: (params?: Record<string, string>) => {
      const base = '/api/uploads/history';
      if (!params) return base;
      return `${base}?${new URLSearchParams(params).toString()}`;
    },
  },

  // Audit
  audit: {
    list: (params?: Record<string, string>) => {
      const base = '/api/audit/events';
      if (!params) return base;
      return `${base}?${new URLSearchParams(params).toString()}`;
    },
    detail: (id: string) => `/api/audit/events/${id}`,
  },
};
