import { cookies } from "next/headers";

import { createPortfolioAccessServer } from "@shared/lib/db/portfolio-access";
import { createProtectedProfileReader } from "@shared/lib/portfolio-access";

import { env } from "@/env";

export function portfolioAccessServer() {
  return createPortfolioAccessServer({
    secret: env.SUPABASE_SERVICE_ROLE_KEY,
    url: env.NEXT_PUBLIC_SUPABASE_URL,
  });
}

export const readProtectedProfile = createProtectedProfileReader({
  accessServer: portfolioAccessServer,
  readCookie: async (name) => (await cookies()).get(name)?.value,
});
