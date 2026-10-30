import { createAuthHandlers } from "@shared/auth/handlers";
import { ProfileAccessError } from "@shared/lib/profile-errors";
import { createServerClient } from "@shared/lib/supabase";

import { requireWorkspace } from "./admin-auth";

export const authHandlers = createAuthHandlers({
  accessErrorCode: "not_owner",
  accessErrorMessage: "Confirm your account before opening your portfolio studio.",
  afterSignIn: requireWorkspace,
  callbackPath: "/auth/callback",
  createClient: createServerClient,
  isAccessError: (error) => error instanceof ProfileAccessError,
  loginPath: "/admin/login",
  setupErrorMessage: "Portfolio storage is not ready. Check the Supabase setup.",
  successPath: "/admin",
});
