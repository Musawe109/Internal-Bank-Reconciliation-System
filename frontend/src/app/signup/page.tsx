/**
 * Sign up page for Internal Bank Reconciliation System.
 * Note: Self-service signup is disabled. Users must contact administrator.
 */

'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card/Card';
import { Button } from '@/components/ui/button/Button';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-gray-900">
            <span className="text-2xl font-bold text-white">IB</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Internal Bank Reconciliation System
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enterprise bank reconciliation platform
          </p>
        </div>

        {/* Sign Up Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Registration</CardTitle>
            <CardDescription>
              IBRS is an internal enterprise system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Info Box */}
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Administrator Required
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      IBRS is an internal system for authorized personnel only.
                      New user accounts must be created by a system administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-xs font-medium text-gray-600">1</span>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Contact your department administrator to request access
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-xs font-medium text-gray-600">2</span>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Provide your work email and role justification
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-xs font-medium text-gray-600">3</span>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Once approved, you&apos;ll receive login credentials via email
                </p>
              </div>
            </div>

            {/* Back to Login */}
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link
              href="/support"
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Contact IT Support
            </Link>
          </p>
        </div>

        {/* System Status */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            IBRS Version 1.0.0 | Internal Use Only
          </p>
        </div>
      </div>
    </div>
  );
}
