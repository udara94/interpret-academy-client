import ApiManager from "./api-manager";
import { BaseResponse, AuthResponse, LoginCredentials, RefreshTokenResponse, ErrorResponse } from "@/types";

export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<BaseResponse<AuthResponse> | ErrorResponse> {
    try {
      const response = await ApiManager.post<BaseResponse<AuthResponse>>(
        "/app/auth/login",
        credentials
      );
      
      if (!response.data) {
        return {
          statusCode: 500,
          message: "No data in response",
          error: "Empty response from server",
        };
      }
      
      // Backend returns BaseResponse format
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      console.error("Error response:", error.response?.data);
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Login failed",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Register a new user
   */
  async signup(data: {
    username: string;
    email: string;
    password: string;
    languageId?: string;
    roleId?: string;
  }): Promise<BaseResponse<AuthResponse> | ErrorResponse> {
    try {
      const response = await ApiManager.post<BaseResponse<AuthResponse>>(
        "/app/auth/signup",
        data
      );
      
      // Backend returns BaseResponse format via TransformInterceptor
      // response.data is already BaseResponse<AuthResponse>
      if (response.data) {
        // Check if it's already in BaseResponse format
        if ('statusCode' in response.data && 'data' in response.data) {
          return response.data;
        }
        
        // If response.data is the raw AuthResponse (shouldn't happen with TransformInterceptor)
        // but handle it just in case
        if ('accessToken' in response.data && 'refreshToken' in response.data) {
          return {
            statusCode: response.status || 201,
            data: response.data as unknown as AuthResponse,
          };
        }
      }
      
      // Fallback
      return {
        statusCode: response.status || 201,
        data: response.data as unknown as AuthResponse,
      };
    } catch (error: any) {
      console.error("Signup API error:", error);
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 
                            (Array.isArray(error.response?.data?.message) 
                              ? error.response.data.message.join(', ')
                              : 'Validation failed');
        return {
          statusCode: 400,
          message: errorMessage,
          error: 'Validation error',
        };
      }
      
      // Handle other errors
      const errorData = error.response?.data;
      if (errorData && 'statusCode' in errorData) {
        return errorData as ErrorResponse;
      }
      
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Signup failed",
        error: error.message || "Unknown error",
      };
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<BaseResponse<RefreshTokenResponse> | ErrorResponse> {
    try {
      const response = await ApiManager.post<BaseResponse<RefreshTokenResponse>>(
        "/app/auth/refresh-token",
        { refreshToken }
      );
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Token refresh failed",
        error: error.message,
      };
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<BaseResponse<{ message: string }> | ErrorResponse> {
    try {
      const response = await ApiManager.post<BaseResponse<{ message: string }>>(
        "/app/auth/forgot-password",
        { email }
      );
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Password reset request failed",
        error: error.message,
      };
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<BaseResponse<{ message: string }> | ErrorResponse> {
    try {
      const response = await ApiManager.post<BaseResponse<{ message: string }>>(
        "/app/auth/reset-password",
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Password reset failed",
        error: error.message,
      };
    }
  },
};

