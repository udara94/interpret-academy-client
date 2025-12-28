"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { paymentsApi, MembershipProduct } from "@/lib/api/payments-api";

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<MembershipProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      loadProducts();
    }
  }, [status, session]);

  const loadProducts = async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const response = await paymentsApi.getProducts(session.accessToken as string);

      if ("statusCode" in response && response.statusCode >= 400) {
        toast.error(response.message || "Failed to load products");
      } else {
        const productsList = response as MembershipProduct[];
        setProducts(productsList);
        
        // Select the plan with the highest days by default
        if (productsList.length > 0) {
          const highestDaysProduct = productsList.reduce((prev, current) => 
            (current.days > prev.days) ? current : prev
          );
          setSelectedProductId(highestDaysProduct.id);
        }
      }
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedProductId) {
      toast.error("Please select a membership plan");
      return;
    }

    if (!session?.accessToken) {
      toast.error("Please log in to purchase a membership");
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);
    if (!selectedProduct) {
      toast.error("Selected product not found");
      return;
    }

    if (!selectedProduct.stripeProductId) {
      toast.error("Product ID not configured. Please contact support.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await paymentsApi.createCheckoutSession(
        selectedProduct.stripeProductId,
        session.accessToken as string
      );

      if ("statusCode" in response && response.statusCode >= 400) {
        toast.error(response.message || "Failed to create checkout session");
        setIsProcessing(false);
      } else {
        const checkoutResponse = response as { sessionId: string; url: string };
        // Redirect to Stripe Checkout
        if (checkoutResponse.url) {
          window.location.href = checkoutResponse.url;
        } else {
          toast.error("Checkout URL not available");
          setIsProcessing(false);
        }
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error("An error occurred while processing your request");
      setIsProcessing(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  if (status === "loading" || isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="ml-4 text-secondary-600 dark:text-secondary-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-8">
        Membership Plans
      </h1>

      {/* Membership Plans - Selectable */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {products.map((product) => {
              const isSelected = selectedProductId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`card p-6 flex flex-col cursor-pointer transition-all relative overflow-hidden ${
                    isSelected
                      ? "card-hover"
                      : "card-hover"
                  } ${!product.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={isSelected ? {
                    border: '4px solid #f59e0b', // primary-500 - 4px solid border
                    boxSizing: 'border-box'
                  } : {}}
                >
                  {/* Primary Color Triangular Checkmark Overlay at Right Bottom */}
                  {isSelected && (
                    <>
                      {/* Triangular overlay using CSS border trick with primary color */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-b-[60px] border-b-primary-500"></div>
                      {/* Checkmark positioned inside triangle */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <svg
                          className="w-5 h-5 text-white"
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
                    </>
                  )}

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                      {product.description || `Full access for ${product.days} days`}
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {product.days}
                      </span>
                      <span className="text-secondary-600 dark:text-secondary-400 ml-2">
                        days access
                      </span>
                      {product.price && (
                        <div className="mt-2">
                          <span className="text-2xl font-semibold text-secondary-900 dark:text-white">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <span className="text-secondary-600 dark:text-secondary-400 ml-1">
                            {product.currency.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {product.features && product.features.length > 0 && (
                      <>
                        <div className="border-t-2 border-secondary-300 dark:border-secondary-600 my-4"></div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-2">
                            Features:
                          </h4>
                        <ul className="space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-secondary-700 dark:text-secondary-300">
                              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Purchase Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !selectedProductId || !selectedProduct?.isActive}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[300px]"
            >
              {isProcessing
                ? "Processing..."
                : selectedProduct
                ? `Purchase ${selectedProduct.name}`
                : "Select a Plan to Continue"}
            </button>
          </div>
        </>
      ) : (
        <div className="card p-6 text-center">
          <p className="text-secondary-600 dark:text-secondary-400">
            No membership plans available at the moment.
          </p>
        </div>
      )}

      {/* Info Message */}
      <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> All plans are one-time payments. Your membership will be active for the selected number of days from the purchase date.
        </p>
      </div>
    </div>
  );
}
