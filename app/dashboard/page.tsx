import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
        Dashboard
      </h1>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6">
        Welcome back, {session?.user?.email}!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Dialogs
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Practice with interactive dialogs
          </p>
        </div>
        
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Practice
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Improve your interpretation skills
          </p>
        </div>
        
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Profile
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage your account settings
          </p>
        </div>
      </div>
    </div>
  );
}

