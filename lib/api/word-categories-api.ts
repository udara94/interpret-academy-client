import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";
import { getSession } from "next-auth/react";

export interface WordCategory {
  id: string;
  category: string;
  description: string | null;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WordCategoriesResponse {
  data: WordCategory[];
  count: number;
}

export const wordCategoriesApi = {
  /**
   * Get all word categories
   * Optionally filter by isFree status
   */
  async getWordCategories(isFree?: boolean): Promise<WordCategoriesResponse | ErrorResponse> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        return {
          statusCode: 401,
          message: "Not authenticated",
          error: "Authentication required",
        };
      }

      let url = `/app/word-categories`;
      if (isFree !== undefined) {
        url += `?isFree=${isFree}`;
      }

      const response = await ApiManager.get<BaseResponse<WordCategoriesResponse>>(
        url,
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
      const wrappedResponse = response.data as BaseResponse<WordCategoriesResponse>;
      
      // Check if it's an error response
      if (wrappedResponse.statusCode >= 400) {
        return {
          statusCode: wrappedResponse.statusCode,
          message: (wrappedResponse as any).message || "Failed to fetch word categories",
          error: (wrappedResponse as any).error || "Unknown error",
        };
      }
      
      // Extract the actual categories response from the wrapped format
      return wrappedResponse.data;
    } catch (error: any) {
      console.error("Get Word Categories API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch word categories",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Get a single word category by ID
   */
  async getWordCategoryById(categoryId: string): Promise<WordCategory | ErrorResponse> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        return {
          statusCode: 401,
          message: "Not authenticated",
          error: "Authentication required",
        };
      }

      const response = await ApiManager.get<BaseResponse<WordCategory>>(
        `/app/word-categories/${categoryId}`,
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
      
      const wrappedResponse = response.data as BaseResponse<WordCategory>;
      
      if (wrappedResponse.statusCode >= 400) {
        return {
          statusCode: wrappedResponse.statusCode,
          message: (wrappedResponse as any).message || "Failed to fetch word category",
          error: (wrappedResponse as any).error || "Unknown error",
        };
      }
      
      return wrappedResponse.data;
    } catch (error: any) {
      console.error("Get Word Category API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch word category",
        error: error.message || "Unknown error",
      };
    }
  },
};

