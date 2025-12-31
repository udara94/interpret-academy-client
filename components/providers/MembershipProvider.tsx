"use client";

import { useMembership } from "@/lib/hooks/use-membership";

/**
 * Provider component that initializes membership status checking
 * This component should be placed in the layout to ensure membership
 * status is checked globally when the app loads
 */
export default function MembershipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This hook will automatically check membership status when authenticated
  useMembership();

  return <>{children}</>;
}

