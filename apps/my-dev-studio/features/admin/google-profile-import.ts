import { env } from "@/env";

export function googleProfileClientId() {
  const value = env.GOOGLE_PROFILE_CLIENT_ID || "";
  return /^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/.test(value) ? value : null;
}
