import { createClient as createAuthClient } from "@shared/auth/server";

import type { Database } from "../types";

export const createClient = () => createAuthClient<Database>();
