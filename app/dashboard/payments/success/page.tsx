"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { paymentsApi, PaymentDetails, VerifySessionResponse } from "@/lib/api/payments-api";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [hasVerified, setHasVerified] = useState(false); // Prevent multiple verifications

  useEffect(() => {
    if (status === "loading") return;
    if (hasVerified) return; // Don't verify again if already verified

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
  }, [status, session?.accessToken]); // Removed searchParams and session object to prevent re-runs

  const verifyPayment = async (sessionId: string) => {
    if (!session?.accessToken) return;
    if (hasVerified) return; // Prevent multiple calls

    setIsVerifying(true);
    setHasVerified(true); // Mark as verified to prevent re-runs
    
    try {
      const response = await paymentsApi.verifySession(
        sessionId,
        session.accessToken as string
      );

      if ("statusCode" in response && response.statusCode >= 400) {
        const errorMessage = response.message || "Failed to verify payment";
        console.error("Payment verification failed:", {
          statusCode: response.statusCode,
          message: errorMessage,
          error: (response as any).error,
        });
        toast.error(errorMessage);
        setIsSuccess(false);
      } else {
        const verifyResponse = response as VerifySessionResponse;
        
        // Validate payment details exist
        if (!verifyResponse.payment) {
          console.error("Payment details missing from response:", verifyResponse);
          toast.error("Payment verified but details are missing. Please contact support.");
          setIsSuccess(false);
          return;
        }
        
        setPaymentDetails(verifyResponse.payment);
        setIsSuccess(true);
        
        // Only show success toast once
        toast.success("Payment verified! Your membership has been activated.", {
          toastId: "payment-verified", // Prevent duplicate toasts
        });
        
        // Trigger sidebar to refresh membership status
        // Dispatch a custom event that the sidebar can listen to
        // Don't call update() as it might trigger language selection redirect
        window.dispatchEvent(new CustomEvent('membership-status-changed'));
        
        // User stays on success page - no automatic redirect
      }
    } catch (error: any) {
      console.error("Error verifying payment:", {
        error,
        message: error?.message,
        response: error?.response?.data,
      });
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred while verifying your payment";
      toast.error(errorMessage);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getPaymentMethodName = (provider: string) => {
    switch (provider) {
      case "stripe":
        return "Credit/Debit Card";
      case "apple_iap":
        return "Apple Pay";
      case "google_iap":
        return "Google Pay";
      default:
        return "Payment";
    }
  };

  const downloadReceipt = () => {
    if (!paymentDetails) return;

    const receiptContent = `
RECEIPT - INTERPRET ACADEMY
============================

Transaction ID: ${paymentDetails.externalTransactionId}
Payment ID: ${paymentDetails.id}
Date: ${formatDate(paymentDetails.createdAt)}

Product: ${paymentDetails.productName}
Duration: ${paymentDetails.productDays} days
Amount: ${formatCurrency(paymentDetails.amount, paymentDetails.currency)}
Payment Method: ${getPaymentMethodName(paymentDetails.paymentProvider)}

Status: Completed

Thank you for your purchase!
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${paymentDetails.externalTransactionId.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pt-20">
      <div className="card p-8 md:p-12">
        {/* Success Icon with Animation */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <svg
                className="w-12 h-12 text-green-600 dark:text-green-400 animate-checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-800 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-300 dark:border-green-700 animate-ping opacity-10" style={{ animationDelay: "0.5s" }}></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg md:text-xl text-secondary-700 dark:text-secondary-300 mb-8 max-w-2xl">
            Your membership has been activated successfully. You now have full access to all premium features!
          </p>
        </div>

        {/* Transaction Details */}
        {paymentDetails && (
          <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-6 mb-8 border border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              Transaction Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Transaction ID
                </p>
                <p className="text-base font-mono text-secondary-900 dark:text-white break-all">
                  {paymentDetails.externalTransactionId}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Amount Paid
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(paymentDetails.amount, paymentDetails.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Payment Method
                </p>
                <p className="text-base font-medium text-secondary-900 dark:text-white">
                  {getPaymentMethodName(paymentDetails.paymentProvider)}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Date & Time
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {formatDate(paymentDetails.createdAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* What's Included */}
        {paymentDetails && paymentDetails.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              What's Included in Your Membership
            </h2>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 border-l-4 border-primary-500">
              <ul className="space-y-3">
                {paymentDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0"
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
                    <span className="text-secondary-900 dark:text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
            Next Steps
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-secondary-900 dark:text-white">
                  Explore Premium Dialogs
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Access all premium dialog content and practice your language skills
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-secondary-900 dark:text-white">
                  Build Your Vocabulary
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Access premium word categories and expand your vocabulary
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-secondary-900 dark:text-white">
                  Track Your Progress
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Monitor your learning journey and see your improvement over time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard/dialogs"
            className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold text-center"
          >
            Browse Dialogs
          </Link>
          {paymentDetails && (
            <button
              onClick={downloadReceipt}
              className="px-8 py-4 border-2 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors font-semibold"
            >
              Download Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

