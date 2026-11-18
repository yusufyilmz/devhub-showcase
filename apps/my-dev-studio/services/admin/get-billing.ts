import { billingPost as billingPostCore } from "@shared/billing/handler";
import { createServerClient } from "@shared/lib/supabase";

export function billingPost(request: Request, action: (account: string) => Promise<string>) {
  return billingPostCore(request, action, createServerClient);
}
