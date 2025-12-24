import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// Get API URL from environment variable
// In Next.js, NEXT_PUBLIC_* variables are available on both client and server
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/local/api";
  }
  // Server-side: use environment variable
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/local/api";
};

const ApiManager: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
ApiManager.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token will be added by individual API calls using getSession
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
ApiManager.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if response is HTML (redirect to login page)
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
      // This is an HTML response, likely a redirect - don't redirect again
      // Just reject with a proper error
      const htmlError = new Error('Authentication required');
      (htmlError as any).response = {
        status: 401,
        data: { message: 'Authentication failed. Please log in again.' },
      };
      return Promise.reject(htmlError);
    }
    
    // Only redirect on 401 if we're not already on an auth page
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // Don't redirect if already on login page or if we're in dashboard
        // Let the component handle the error instead
        if (!currentPath.includes("/login") && !currentPath.includes("/dashboard")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default ApiManager;



