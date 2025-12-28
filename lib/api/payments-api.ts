import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";

export interface MembershipStatus {
  isActive: boolean;
  startDate: string | null;
  expiryDate: string | null;
  daysRemaining: number | null;
  plan: string | null;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  paymentProvider: 'stripe' | 'apple_iap' | 'google_iap';
  externalTransactionId: string;
  createdAt: string;
  productName: string;
  productDays: number;
  features: string[];
}

export interface VerifySessionResponse {
  success: boolean;
  message: string;
  membershipDays: number;
  payment: PaymentDetails;
}

export interface MembershipProduct {
  id: string;
  stripeProductId: string;
  stripePriceId: string | null;
  name: string;
  description: string | null;
  days: number;
  planType: string;
  price: number | null;
  currency: string;
  isActive: boolean;
  features: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export const paymentsApi = {
  /**
   * Create a Stripe checkout session
   */
  async createCheckoutSession(
    productId: string,
    accessToken: string
  ): Promise<CreateCheckoutSessionResponse | ErrorResponse> {
    try {
      const response = await ApiManager.post<BaseResponse<CreateCheckoutSessionResponse>>(
        `/app/payments/create-checkout-session`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const baseResponse = response.data as BaseResponse<CreateCheckoutSessionResponse>;
      if (baseResponse.statusCode !== 200) {
        throw new Error(baseResponse.message || "Failed to create checkout session");
      }

      return baseResponse.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to create checkout session",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Verify payment session and activate membership
   */
  async verifySession(
    sessionId: string,
    accessToken: string
  ): Promise<VerifySessionResponse | ErrorResponse> {
    try {
      const response = await ApiManager.get<BaseResponse<VerifySessionResponse>>(
        `/app/payments/verify-session?session_id=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const baseResponse = response.data as BaseResponse<VerifySessionResponse>;
      if (baseResponse.statusCode !== 200) {
        throw new Error(baseResponse.message || "Failed to verify session");
      }

      return baseResponse.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to verify session",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Get user's membership status
   */
  async getMembershipStatus(
    accessToken: string
  ): Promise<MembershipStatus | ErrorResponse> {
    try {
      const response = await ApiManager.get<BaseResponse<MembershipStatus>>(
        `/app/payments/membership-status`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const baseResponse = response.data as BaseResponse<MembershipStatus>;
      if (baseResponse.statusCode !== 200) {
        throw new Error(baseResponse.message || "Failed to get membership status");
      }

      return baseResponse.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to get membership status",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Get available membership products
   */
  async getProducts(
    accessToken: string
  ): Promise<MembershipProduct[] | ErrorResponse> {
    try {
      const response = await ApiManager.get<BaseResponse<MembershipProduct[]>>(
        `/app/payments/products`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const baseResponse = response.data as BaseResponse<MembershipProduct[]>;
      if (baseResponse.statusCode !== 200) {
        throw new Error(baseResponse.message || "Failed to get products");
      }

      return baseResponse.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to get products",
        error: error.message || "Unknown error",
      };
    }
  },
};

