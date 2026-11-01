import { createClient as createAuthClient } from "@shared/auth/client";

import type { Database } from "../types";

export const createClient = () => createAuthClient<Database>();
