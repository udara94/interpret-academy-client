import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-secondary-700 dark:text-secondary-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}


