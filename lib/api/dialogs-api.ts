import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";
import { getSession } from "next-auth/react";
import { profileApi } from "./profile-api";

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

      // Get languageId from user session, or fetch from backend if missing
      let languageId = session.user?.languageId;
      
      if (!languageId) {
        // Try to fetch user profile from backend to get latest languageId
        console.log("Language ID missing from session, fetching from backend...");
        try {
          const profileResponse = await profileApi.getProfile();
          if ("statusCode" in profileResponse && profileResponse.statusCode === 200) {
            const baseResponse = profileResponse as BaseResponse<any>;
            languageId = baseResponse.data?.languageId;
            
            if (languageId) {
              console.log("Language ID retrieved from backend:", languageId);
              // Note: We don't update the session here to avoid redirect issues
              // The languageId will be fetched from backend on each request if needed
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      
      if (!languageId) {
        console.warn("Language ID still missing after fetching profile");
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

  /**
   * Get a single dialog by ID
   */
  async getDialogById(dialogId: string): Promise<Dialog | ErrorResponse> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        return {
          statusCode: 401,
          message: "Not authenticated",
          error: "Authentication required",
        };
      }

      const response = await ApiManager.get<BaseResponse<Dialog>>(
        `/app/dialogs/${dialogId}`,
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
      
      const wrappedResponse = response.data as BaseResponse<Dialog>;
      
      if (wrappedResponse.statusCode >= 400) {
        return {
          statusCode: wrappedResponse.statusCode,
          message: (wrappedResponse as any).message || "Failed to fetch dialog",
          error: (wrappedResponse as any).error || "Unknown error",
        };
      }
      
      return wrappedResponse.data;
    } catch (error: any) {
      console.error("Get Dialog API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch dialog",
        error: error.message || "Unknown error",
      };
    }
  },
};

