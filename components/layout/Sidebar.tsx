"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const navigationItems = [
  { name: "Dashboard", href: ROUTES.DASHBOARD.HOME, icon: "📊" },
  { name: "Dialogs", href: ROUTES.DASHBOARD.DIALOGS, icon: "💬", badge: null },
  { name: "Practice", href: ROUTES.DASHBOARD.PRACTICE, icon: "🎯" },
  { name: "Messages", href: "/dashboard/messages", icon: "💬", badge: 8 },
  { name: "Analytics", href: "/dashboard/analytics", icon: "📈" },
  { name: "Payments", href: "/dashboard/payments", icon: "💳" },
];

const bottomItems = [
  { name: "Support", href: "/dashboard/support", icon: "❓" },
  { name: "Settings", href: ROUTES.DASHBOARD.SETTINGS, icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-secondary-900 dark:bg-secondary-950 h-[calc(100vh-2rem)] flex flex-col m-4 rounded-xl shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-800">
        <Link href={ROUTES.DASHBOARD.HOME} className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IA</span>
          </div>
          <span className="text-xl font-bold text-white">Interpret Academy</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 group
                ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-secondary-300 hover:bg-secondary-800 hover:text-white"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="p-4 border-t border-secondary-800 space-y-2">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-secondary-300 hover:bg-secondary-800 hover:text-white"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

