import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verify session is valid - check for user data
  if (!session || !session.user || !session.user.email) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="flex flex-col">
        <header className="bg-white dark:bg-secondary-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                Interpret Academy
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {session.user.email}
                </span>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

