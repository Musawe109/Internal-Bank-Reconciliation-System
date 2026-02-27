/**
 * Layout for dashboard pages (dashboard, reconciliation, upload, audit).
 * Provides sidebar navigation and header.
 * Excludes auth pages (login, signup) which have their own layouts.
 */

import Sidebar from '@/components/dashboard/navigation/Sidebar';
import Header from '@/components/dashboard/navigation/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
