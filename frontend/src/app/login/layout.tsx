/**
 * Layout for authentication pages (login, signup, etc.).
 * No sidebar or header - full screen centered layout.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
