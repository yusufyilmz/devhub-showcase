import { createClient as createAuthClient } from "@shared/auth/server";

import type { Database } from "../../types/index";

export const createClient = () => createAuthClient<Database>();
