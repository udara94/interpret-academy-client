import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";
import { getSession } from "next-auth/react";

export interface UpdateLanguageResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    languageId: string | null;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  languageId: string | null;
  roleId: string | null;
}

export const profileApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<BaseResponse<UserProfile> | ErrorResponse> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        return {
          statusCode: 401,
          message: "Not authenticated",
          error: "Authentication required",
        };
      }

      const response = await ApiManager.get<BaseResponse<UserProfile>>(
        "/app/profile",
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
      
      return response.data;
    } catch (error: any) {
      console.error("Get Profile API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch profile",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Update user's language
   */
  async updateLanguage(languageId: string): Promise<BaseResponse<UpdateLanguageResponse> | ErrorResponse> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        return {
          statusCode: 401,
          message: "Not authenticated",
          error: "Authentication required",
        };
      }

      const response = await ApiManager.put<BaseResponse<UpdateLanguageResponse>>(
        "/app/profile/language",
        { languageId },
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
      
      return response.data;
    } catch (error: any) {
      console.error("Update Language API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to update language",
        error: error.message || "Unknown error",
      };
    }
  },
};

