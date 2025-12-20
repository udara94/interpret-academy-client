export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
        Dashboard
      </h1>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6">
        Welcome to Interpret Academy!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card card-hover p-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Dialogs
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Practice with interactive dialogs
          </p>
        </div>
        
        <div className="card card-hover p-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Practice
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Improve your interpretation skills
          </p>
        </div>
        
        <div className="card card-hover p-6">
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

