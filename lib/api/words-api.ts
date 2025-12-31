import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";
import { getSession } from "next-auth/react";
import { profileApi } from "./profile-api";

export interface WordInterpretation {
  id: string;
  interpretedWord: string;
  languageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordWithInterpretation {
  id: string;
  word: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  interpretations: WordInterpretation[];
}

export interface WordsWithInterpretationsResponse {
  data: WordWithInterpretation[];
  count: number;
}

export const wordsApi = {
  /**
   * Get words with their interpreted meanings for a specific category and language
   * Fetches the user's languageId from session and calls the backend
   */
  async getWordsWithInterpretations(categoryId: string): Promise<WordsWithInterpretationsResponse | ErrorResponse> {
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
      let languageId = session.user?.languageId;
      
      // If languageId is not in session (common for newly created users),
      // try to fetch it from the profile API as a fallback
      if (!languageId) {
        try {
          const profileResponse = await profileApi.getProfile();
          if ("statusCode" in profileResponse && profileResponse.statusCode === 200) {
            const baseResponse = profileResponse as any;
            const userProfile = baseResponse.data;
            languageId = userProfile?.languageId;
          }
        } catch (error) {
          console.error("Error fetching profile for languageId:", error);
          // Continue to return error below
        }
      }
      
      if (!languageId) {
        return {
          statusCode: 400,
          message: "Language not selected",
          error: "Please select a language in your profile",
        };
      }

      const response = await ApiManager.get<BaseResponse<WordsWithInterpretationsResponse>>(
        `/app/words?categoryId=${categoryId}&languageId=${languageId}`,
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
      const wrappedResponse = response.data as BaseResponse<WordsWithInterpretationsResponse>;
      
      // Check if it's an error response
      if (wrappedResponse.statusCode >= 400) {
        return {
          statusCode: wrappedResponse.statusCode,
          message: (wrappedResponse as any).message || "Failed to fetch words",
          error: (wrappedResponse as any).error || "Unknown error",
        };
      }
      
      // Extract the actual words response from the wrapped format
      return wrappedResponse.data;
    } catch (error: any) {
      console.error("Get Words API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch words",
        error: error.message || "Unknown error",
      };
    }
  },
};

