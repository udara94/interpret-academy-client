import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authApi } from "@/lib/api/auth-api";
import { AuthResponse, ErrorResponse, BaseResponse } from "@/types";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const response = await authApi.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          // Check if it's an error response
          if ("statusCode" in response && response.statusCode !== 200) {
            const errorResponse = response as ErrorResponse;
            console.error("Login failed:", errorResponse.message);
            return null;
          }

          // Response is in BaseResponse format
          const baseResponse = response as BaseResponse<AuthResponse>;
          
          if (!baseResponse.data) {
            console.error("No data in response");
            return null;
          }

          const loginResponse = baseResponse.data;
          
          // Validate response structure
          if (!loginResponse || !loginResponse.user || !loginResponse.accessToken) {
            console.error("Invalid response structure:", loginResponse);
            return null;
          }

          // Calculate expiry (JWT tokens typically expire in 1 hour, adjust as needed)
          const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

          return {
            id: loginResponse.user.id,
            email: loginResponse.user.email,
            name: loginResponse.user.username || loginResponse.user.email,
            accessToken: loginResponse.accessToken,
            refreshToken: loginResponse.refreshToken,
            expiresAt: expiresAt,
            user: loginResponse.user,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          if (error instanceof Error) {
            console.error("Error details:", error.message, error.stack);
          }
          return null;
        }
      },
    }),
  ],
};


