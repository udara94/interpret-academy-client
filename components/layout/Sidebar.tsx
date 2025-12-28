"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/routes";
import { paymentsApi } from "@/lib/api/payments-api";

const allNavigationItems = [
  { name: "Home", href: ROUTES.DASHBOARD.HOME, icon: "🏠" },
  { name: "Dialogs", href: ROUTES.DASHBOARD.DIALOGS, icon: "💬" },
  { name: "vocabulary", href: "/dashboard/vocabulary", icon: "📚" },
  { name: "Exam", href: "/dashboard/exam", icon: "📝" },
  { name: "contact us", href: "/dashboard/contact", icon: "📧" },
  { name: "premium access", href: ROUTES.DASHBOARD.PAYMENTS, icon: "💎" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      checkMembershipStatus();
    }
  }, [status, session, pathname]); // Also check when pathname changes (user navigates)

  const checkMembershipStatus = async () => {
    if (!session?.accessToken) return;

    try {
      const response = await paymentsApi.getMembershipStatus(session.accessToken as string);
      
      if ("statusCode" in response && response.statusCode >= 400) {
        // If error, assume no active membership (show premium access tab)
        setHasActiveMembership(false);
      } else {
        // Check if membership is active
        const membershipStatus = response as { isActive: boolean };
        setHasActiveMembership(membershipStatus.isActive);
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
      // On error, assume no active membership (show premium access tab)
      setHasActiveMembership(false);
    }
  };

  // Filter navigation items based on membership status
  // Show "premium access" only if user doesn't have active membership
  const navigationItems = hasActiveMembership === null
    ? allNavigationItems // Show all while loading
    : allNavigationItems.filter(item => 
        item.name !== "premium access" || !hasActiveMembership
      );

  return (
    <aside className="w-64 bg-white/40 dark:bg-secondary-800/40 backdrop-blur-[12px] border-r border-secondary-200/80 dark:border-secondary-700/80 shadow-md h-screen fixed left-0 top-0 flex flex-col z-40">
      {/* Logo & Name */}
      <div className="p-6 border-b border-secondary-200/80 dark:border-secondary-700/80">
        <Link href={ROUTES.DASHBOARD.HOME} className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IA</span>
          </div>
          <span className="text-xl font-bold text-secondary-900 dark:text-white">Interpret Academy</span>
        </Link>
      </div>

      {/* Navigation Items - Vertical */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          // For Home route, only match exact path to avoid matching sub-routes
          // For other routes, match exact path or sub-routes
          const isActive = item.href === ROUTES.DASHBOARD.HOME
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-secondary-700 dark:text-secondary-300 hover:bg-white/60 dark:hover:bg-secondary-700/60"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium capitalize">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

