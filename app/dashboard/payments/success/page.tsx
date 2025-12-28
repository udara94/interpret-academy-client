"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { paymentsApi } from "@/lib/api/payments-api";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.accessToken) {
      router.push("/login");
      return;
    }

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      toast.error("Invalid payment session");
      router.push("/dashboard/payments");
      return;
    }

    verifyPayment(sessionId);
  }, [status, session, searchParams]);

  const verifyPayment = async (sessionId: string) => {
    if (!session?.accessToken) return;

    setIsVerifying(true);
    try {
      const response = await paymentsApi.verifySession(
        sessionId,
        session.accessToken as string
      );

      if ("statusCode" in response && response.statusCode >= 400) {
        toast.error(response.message || "Failed to verify payment");
        setIsSuccess(false);
      } else {
        toast.success("Payment verified! Your membership has been activated.");
        setIsSuccess(true);
        // User stays on success page - no automatic redirect
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      toast.error("An error occurred while verifying your payment");
      setIsSuccess(false);
    } finally {
      setIsVerifying(false);
    }
  };

  if (status === "loading" || isVerifying) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="card p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Verifying Payment...
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Please wait while we verify your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="card p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              We couldn't verify your payment. Please contact support if you were charged.
            </p>
            <Link
              href="/dashboard/payments"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to Payments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      <div className="card p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Your membership has been activated successfully. You now have full access to all premium features!
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/dashboard/dialogs"
              className="px-6 py-3 bg-secondary-200 dark:bg-secondary-700 text-secondary-900 dark:text-white rounded-lg hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-colors font-medium"
            >
              Browse Dialogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

