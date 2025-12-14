"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const navigationItems = [
  { name: "Dashboard", href: ROUTES.DASHBOARD.HOME, icon: "📊" },
  { name: "Dialogs", href: ROUTES.DASHBOARD.DIALOGS, icon: "💬" },
  { name: "Practice", href: ROUTES.DASHBOARD.PRACTICE, icon: "🎯" },
  { name: "Profile", href: ROUTES.DASHBOARD.PROFILE, icon: "👤" },
  { name: "Settings", href: ROUTES.DASHBOARD.SETTINGS, icon: "⚙️" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD.HOME} className="flex items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Interpret Academy
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Guest User
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

