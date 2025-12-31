"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { paymentsApi, MembershipStatus } from "@/lib/api/payments-api";
import { setMembershipStatus, setLoading, clearMembership } from "@/lib/store/slices/membership-slice";

/**
 * Custom hook to manage membership status globally
 * This hook automatically checks membership status when authenticated
 * and provides the membership state to components
 */
export function useMembership() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const membershipState = useAppSelector((state) => state.membership);
  const isCheckingRef = useRef(false);

  const checkMembershipStatus = useCallback(async () => {
    if (!session?.accessToken) {
      dispatch(clearMembership());
      return;
    }

    // Prevent multiple simultaneous checks
    if (isCheckingRef.current) {
      return;
    }

    // Don't check if we've checked recently (within last 30 seconds)
    const now = Date.now();
    if (
      membershipState.lastChecked &&
      now - membershipState.lastChecked < 30000 &&
      membershipState.status !== null
    ) {
      return;
    }

    isCheckingRef.current = true;
    dispatch(setLoading(true));

    try {
      const response = await paymentsApi.getMembershipStatus(
        session.accessToken as string
      );

      if ("statusCode" in response && response.statusCode >= 400) {
        // If error, set status to inactive
        dispatch(
          setMembershipStatus({
            isActive: false,
            startDate: null,
            expiryDate: null,
            daysRemaining: null,
            plan: null,
          })
        );
      } else {
        // Success - set the membership status
        // Type assertion: after checking for error, response must be MembershipStatus
        const membershipStatus = response as MembershipStatus;
        dispatch(setMembershipStatus(membershipStatus));
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
      // On error, set status to inactive
      dispatch(
        setMembershipStatus({
          isActive: false,
          startDate: null,
          expiryDate: null,
          daysRemaining: null,
          plan: null,
        })
      );
    } finally {
      isCheckingRef.current = false;
    }
  }, [session?.accessToken, dispatch]);

  // Check membership status when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      // Only check if we don't have recent data
      const now = Date.now();
      if (
        !membershipState.lastChecked ||
        now - membershipState.lastChecked >= 30000 ||
        membershipState.status === null
      ) {
        checkMembershipStatus();
      }
    } else if (status === "unauthenticated") {
      dispatch(clearMembership());
    }
  }, [status, session?.accessToken, checkMembershipStatus, dispatch, membershipState.lastChecked, membershipState.status]);

  // Listen for membership status changes (e.g., after successful payment)
  useEffect(() => {
    const handleMembershipStatusChange = () => {
      // Add a small delay to ensure backend has processed the payment
      setTimeout(() => {
        if (status === "authenticated" && session?.accessToken) {
          // Force refresh by clearing lastChecked
          dispatch(clearMembership());
          checkMembershipStatus();
        }
      }, 1000);
    };

    window.addEventListener("membership-status-changed", handleMembershipStatusChange);

    return () => {
      window.removeEventListener("membership-status-changed", handleMembershipStatusChange);
    };
  }, [status, session?.accessToken, checkMembershipStatus, dispatch]);

  // Force refresh function that can be called manually
  const refreshMembershipStatus = useCallback(() => {
    dispatch(clearMembership());
    checkMembershipStatus();
  }, [checkMembershipStatus, dispatch]);

  return {
    membershipStatus: membershipState.status,
    isLoading: membershipState.isLoading,
    hasActiveMembership: membershipState.status?.isActive ?? false,
    refreshMembershipStatus,
  };
}

