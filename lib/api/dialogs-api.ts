import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";
import { getSession } from "next-auth/react";

export interface Dialog {
  id: string;
  title: string;
  description: string | null;
  isFree: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface DialogsResponse {
  data: Dialog[];
  count: number;
}

export const dialogsApi = {
  /**
   * Get published dialogs for the user's language
   * Fetches the user's languageId from session and calls the backend
   */
  async getPublishedDialogs(): Promise<DialogsResponse | ErrorResponse> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        return {
          statusCode: 401,
          message: "Not authenticated",
          error: "Authentication required",
        };
      }

      // Get languageId from user session
      const languageId = session.user?.languageId;
      if (!languageId) {
        return {
          statusCode: 400,
          message: "Language not selected",
          error: "Please select a language in your profile",
        };
      }

      const response = await ApiManager.get<BaseResponse<DialogsResponse>>(
        `/app/dialogs?languageId=${languageId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      
      if (!response.data) {
        return {
          statusCode: 500,
          message: "No data in response",
          error: "Empty response from server",
        };
      }
      
      // The backend TransformInterceptor wraps the response as { statusCode, data }
      // So response.data is { statusCode: 200, data: { data: Dialog[], count: number } }
      const wrappedResponse = response.data as BaseResponse<DialogsResponse>;
      
      // Check if it's an error response
      if (wrappedResponse.statusCode >= 400) {
        return {
          statusCode: wrappedResponse.statusCode,
          message: (wrappedResponse as any).message || "Failed to fetch dialogs",
          error: (wrappedResponse as any).error || "Unknown error",
        };
      }
      
      // Extract the actual dialogs response from the wrapped format
      // wrappedResponse.data is { data: Dialog[], count: number }
      return wrappedResponse.data;
    } catch (error: any) {
      console.error("Get Dialogs API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch dialogs",
        error: error.message || "Unknown error",
      };
    }
  },
};

