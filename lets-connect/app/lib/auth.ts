// app/lib/auth.ts
import { createAuthClient } from "@neondatabase/auth/next";

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;

if (!authUrl) {
  throw new Error("NEXT_PUBLIC_NEON_AUTH_URL is missing in .env");
}

export const authClient = createAuthClient({
  baseURL: authUrl 
});