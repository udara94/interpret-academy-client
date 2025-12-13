import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";

export default async function Home() {
  const session = await auth();

  // Verify session is valid - check for user data
  if (session && session.user && session.user.email) {
    redirect(ROUTES.DASHBOARD.HOME);
  } else {
    redirect(ROUTES.AUTH.LOGIN);
  }
}

