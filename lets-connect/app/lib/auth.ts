// app/lib/auth.ts
import { createAuthClient } from "@neondatabase/auth";

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;

if (!authUrl) {
  throw new Error("NEXT_PUBLIC_NEON_AUTH_URL is not defined in your .env file");
}

// Pass the string directly as the first argument
export const authClient = createAuthClient(authUrl);