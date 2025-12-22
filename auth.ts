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
          // Send Google user data to backend
          // Backend will automatically assign the "user" role
          const googleAuthData = {
            email: user.email!,
            name: user.name || user.email!.split("@")[0],
            googleId: account.providerAccountId,
            picture: user.image || profile?.picture,
          };

          const response = await authApi.googleAuth(googleAuthData);

          // Check if it's an error response
          if ("statusCode" in response && response.statusCode >= 200 && response.statusCode < 300) {
            const baseResponse = response as BaseResponse<AuthResponse>;
            const authResponse = baseResponse.data;

            if (!authResponse || !authResponse.accessToken || !authResponse.user) {
              console.error("Invalid auth response structure:", authResponse);
              return false;
            }

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
    async jwt({ token, user, account, trigger }: any) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          user: (user as any).user || {
            id: user.id,
            email: user.email,
            username: (user as any).name,
            languageId: (user as any).user?.languageId || null,
          },
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresAt: (user as any).expiresAt,
        };
      }

      // If session is being updated (e.g., after language change), refresh user data
      if (trigger === "update") {
        try {
          // Refresh token to get updated user data from backend
          if (token.refreshToken) {
            const response = await authApi.refreshToken(token.refreshToken as string);
            if ("statusCode" in response && response.statusCode === 200) {
              const baseResponse = response as BaseResponse<RefreshTokenResponse>;
              const refreshResponse = baseResponse.data;
              const expiresAt = Date.now() + 60 * 60 * 1000;
              
              return {
                ...token,
                accessToken: refreshResponse.accessToken,
                refreshToken: refreshResponse.refreshToken,
                expiresAt: expiresAt,
                user: refreshResponse.user, // This will include updated languageId
              };
            }
          }
        } catch (error) {
          console.error("Error refreshing token for session update:", error);
          // If refresh fails, return current token
          return token;
        }
      }

      // Check if token is still valid
      const timeUntilExpiry = (token.expiresAt as number) - Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      // Only refresh if token is expired or close to expiring
      // This prevents refreshing on every request which would invalidate the refreshToken
      if (timeUntilExpiry > fiveMinutes) {
        // Token is still valid, return it
        // But if user doesn't have languageId, force a refresh to get updated data
        if (!token.user?.languageId && token.refreshToken) {
          try {
            const response = await authApi.refreshToken(token.refreshToken as string);

            if ("statusCode" in response && response.statusCode === 200) {
              const baseResponse = response as BaseResponse<RefreshTokenResponse>;
              const refreshResponse = baseResponse.data;
              const expiresAt = Date.now() + 60 * 60 * 1000;
              
              return {
                ...token,
                accessToken: refreshResponse.accessToken,
                refreshToken: refreshResponse.refreshToken,
                expiresAt: expiresAt,
                user: refreshResponse.user, // This includes updated languageId from DB
              };
            }
          } catch (error) {
            console.error("Error refreshing token for languageId:", error);
          }
        }
        
        return token;
      }

      // Token expired or close to expiring, refresh it
      if (!token.refreshToken) {
        throw new Error("Missing refresh token");
      }

      try {
        const response = await authApi.refreshToken(token.refreshToken as string);

        if ("statusCode" in response && response.statusCode === 200) {
          const baseResponse = response as BaseResponse<RefreshTokenResponse>;
          const refreshResponse = baseResponse.data;
          const expiresAt = Date.now() + 60 * 60 * 1000;
          
          return {
            ...token,
            accessToken: refreshResponse.accessToken,
            refreshToken: refreshResponse.refreshToken,
            expiresAt: expiresAt,
            user: refreshResponse.user, // This includes updated languageId from DB
          };
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        throw error;
      }
    },
    async session({ token, session }: any) {
      return {
        ...session,
        user: {
          ...token.user,
          languageId: token.user?.languageId || null,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
      };
    },
    async redirect({ url, baseUrl }: any) {
      // If redirecting after Google OAuth, check if user needs language selection
      // This callback is called after successful authentication
      if (url.startsWith(baseUrl)) {
        // Check if it's a dashboard redirect
        if (url.includes("/dashboard")) {
          // We'll handle language check in the callback page instead
          // Redirect to our custom callback page to check languageId
          return `${baseUrl}/auth/callback`;
        }
        return url;
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
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


