import ApiManager from "./api-manager";
import { BaseResponse, ErrorResponse } from "@/types";
import { getSession } from "next-auth/react";

export interface EnglishSegment {
  id: string;
  dialogId: string;
  orderNumber: number;
  audioUrl: string;
  segmentText: string;
  wordCount: number;
  type: 'english';
  createdAt: string;
  updatedAt: string;
}

export interface InterpretedSegmentItem {
  id: string;
  languageId: string;
  segmentId: string;
  dialogId: string;
  audioUrl: string;
  segmentText: string;
  wordCount: number;
  status: 'draft' | 'published';
  type: 'interpreted';
  createdAt: string;
  updatedAt: string;
}

export type SegmentItem = EnglishSegment | InterpretedSegmentItem;

export interface SegmentsResponse {
  data: SegmentItem[];
  count: number;
}

export const segmentsApi = {
  /**
   * Get segments for a dialog with interpreted segments interleaved
   * Fetches the user's languageId from session and calls the backend
   * 
   * @param dialogId - The dialog ID
   * @returns List of segments interleaved (English, interpreted, English, interpreted, ...)
   */
  async getSegmentsByDialog(dialogId: string): Promise<SegmentsResponse | ErrorResponse> {
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

      if (!dialogId) {
        return {
          statusCode: 400,
          message: "Dialog ID is required",
          error: "Dialog ID is required",
        };
      }

      const response = await ApiManager.get<BaseResponse<SegmentsResponse>>(
        `/app/segments?dialogId=${dialogId}&languageId=${languageId}`,
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
      // So response.data is { statusCode: 200, data: { data: SegmentItem[], count: number } }
      const wrappedResponse = response.data as BaseResponse<SegmentsResponse>;
      
      // Check if it's an error response
      if (wrappedResponse.statusCode >= 400) {
        return {
          statusCode: wrappedResponse.statusCode,
          message: (wrappedResponse as any).message || "Failed to fetch segments",
          error: (wrappedResponse as any).error || "Unknown error",
        };
      }
      
      // Extract the actual segments response from the wrapped format
      // wrappedResponse.data is { data: SegmentItem[], count: number }
      return wrappedResponse.data;
    } catch (error: any) {
      console.error("Get Segments API error:", error);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to fetch segments",
        error: error.message || "Unknown error",
      };
    }
  },
};

