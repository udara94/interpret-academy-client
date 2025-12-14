import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import LandingPage from "@/components/pages/LandingPage";

export default async function HomePage() {
  const session = await auth();

  // If user is logged in, redirect to dashboard
  if (session && session.user && session.user.email) {
    redirect(ROUTES.DASHBOARD.HOME);
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
