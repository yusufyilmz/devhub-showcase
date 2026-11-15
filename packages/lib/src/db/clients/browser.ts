import { createClient as createAuthClient } from "@shared/auth/client";

import type { Database } from "../../types/index";

export const createClient = () => createAuthClient<Database>();
