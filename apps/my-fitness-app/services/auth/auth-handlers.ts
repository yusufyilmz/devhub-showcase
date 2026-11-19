import { createAuthHandlers } from "@shared/auth/handlers";
import { createClient } from "@shared/auth/server";

/** Same Google and password handlers as MyDevStudio. Fitness does not provision a portfolio. */
export const authHandlers = createAuthHandlers({
  callbackPath: "/auth/callback",
  createClient,
  loginPath: "/login",
  successPath: "/",
});
