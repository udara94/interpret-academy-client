import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { authApi } from "@/lib/api/auth-api";
import { RefreshTokenResponse, ErrorResponse, BaseResponse, AuthResponse } from "@/types";

const nextAuthConfig = {
  ...authConfig,
  trustHost: true, // Trust the host for NextAuth v5
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          console.log("Google OAuth sign in started", { email: user.email, name: user.name });
          
          // Send Google user data to backend
          // Backend will automatically assign the "user" role
          const googleAuthData = {
            email: user.email!,
            name: user.name || user.email!.split("@")[0],
            googleId: account.providerAccountId,
            picture: user.image || profile?.picture,
          };

          console.log("Calling backend Google auth API...");
          const response = await authApi.googleAuth(googleAuthData);
          console.log("Backend response:", response);

          // Check if it's an error response
          if ("statusCode" in response && response.statusCode >= 200 && response.statusCode < 300) {
            const baseResponse = response as BaseResponse<AuthResponse>;
            const authResponse = baseResponse.data;

            if (!authResponse || !authResponse.accessToken || !authResponse.user) {
              console.error("Invalid auth response structure:", authResponse);
              return false;
            }

            console.log("Google auth successful, storing tokens");
            // Store tokens and user data in user object for jwt callback
            user.id = authResponse.user.id;
            user.accessToken = authResponse.accessToken;
            user.refreshToken = authResponse.refreshToken;
            user.user = authResponse.user;
            user.expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

            return true;
          } else {
            const errorResponse = response as ErrorResponse;
            console.error("Google auth failed:", errorResponse);
            return false;
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          if (error instanceof Error) {
            console.error("Error details:", error.message, error.stack);
          }
          return false;
        }
      }

      // For credentials provider, allow sign in
      return true;
    },
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          user: (user as any).user || {
            id: user.id,
            email: user.email,
            username: (user as any).name,
          },
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresAt: (user as any).expiresAt,
        };
      }

      // Check if token is still valid
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Token expired, try to refresh
      if (!token.refreshToken) {
        throw new Error("Missing refresh token");
      }

      try {
        const response = await authApi.refreshToken(token.refreshToken as string);

        // Check if it's an error response
        if ("statusCode" in response && response.statusCode !== 200) {
          throw new Error("Token refresh failed");
        }

        // Response is in BaseResponse format
        const baseResponse = response as BaseResponse<RefreshTokenResponse>;
        const refreshResponse = baseResponse.data;
        
        // Calculate new expiry (1 hour from now)
        const expiresAt = Date.now() + 60 * 60 * 1000;
        
        return {
          ...token,
          accessToken: refreshResponse.accessToken,
          refreshToken: refreshResponse.refreshToken,
          expiresAt: expiresAt,
          user: refreshResponse.user,
        };
      } catch (error) {
        console.error("Token refresh error:", error);
        throw error;
      }
    },
    async session({ token, session }: any) {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = (NextAuth as any)(nextAuthConfig);


