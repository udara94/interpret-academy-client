"use client";

import Link from "next/link";

export default function PaymentErrorPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      <div className="card p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Payment Failed
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Your payment could not be processed. This could be due to:
          </p>
          <ul className="text-left text-secondary-600 dark:text-secondary-400 mb-6 space-y-2 max-w-md">
            <li>• Insufficient funds</li>
            <li>• Card declined</li>
            <li>• Network error</li>
            <li>• Payment was cancelled</li>
          </ul>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard/payments"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Try Again
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

