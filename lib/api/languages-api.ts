import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";

export interface Language {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface LanguagesResponse {
  data: Language[];
  count: number;
}

export const languagesApi = {
  /**
   * Get all available languages
   */
  async getLanguages(): Promise<LanguagesResponse | ErrorResponse> {
    try {
      const response = await ApiManager.get<LanguagesResponse>(
        "/app/languages"
      );
      
      if (!response.data) {
        return {
          statusCode: 500,
          message: "No data in response",
          error: "Empty response from server",
        };
      }
      
      // The backend returns { data: Language[], count: number }
      // Axios wraps it in response.data, so we get the data directly
      return response.data;
    } catch (error: any) {
      console.error("Get Languages API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch languages",
        error: error.message || "Unknown error",
      };
    }
  },
};

