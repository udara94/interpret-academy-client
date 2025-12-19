import { DefaultSession } from "next-auth";
import { User } from "./index";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    languageId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}


