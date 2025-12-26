import Sidebar from "@/components/layout/Sidebar";
import ProfileMenu from "@/components/layout/ProfileMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-gradient-to-r from-[#e3e5e6] to-[#ede0b0] dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 overflow-hidden flex">
      {/* Vertical Sidebar - Left (Fixed) */}
      <Sidebar />

      {/* Main Content Area - Right */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Profile Menu - Top Right */}
        <div className="fixed top-0 right-0 z-50 p-4">
          <ProfileMenu />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
