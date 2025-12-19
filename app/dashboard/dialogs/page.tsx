export default function DialogsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
        Dialogs
      </h1>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6">
        Browse and practice with interactive dialogs
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Dialog 1
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Sample dialog content
          </p>
        </div>
        
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Dialog 2
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Sample dialog content
          </p>
        </div>
        
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Dialog 3
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Sample dialog content
          </p>
        </div>
      </div>
    </div>
  );
}


