"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { ROUTES } from "@/lib/routes";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for NextAuth to process the callback and update the session
        // Try multiple times as session might not be immediately available
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const session = await getSession();
          
          if (session?.user) {
            // User is authenticated, check if they need to select language
            if (!session.user.languageId) {
              router.push(ROUTES.SELECT_LANGUAGE);
              return;
            } else {
              router.push(ROUTES.DASHBOARD.HOME);
              return;
            }
          }
          
          attempts++;
        }
        
        // If we've tried multiple times and still no session, redirect to login
        router.push(ROUTES.AUTH.LOGIN);
      } catch (error) {
        console.error("Error handling auth callback:", error);
        router.push(ROUTES.AUTH.LOGIN);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e3e5e6] to-[#ede0b0]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-secondary-600 dark:text-secondary-400">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}

