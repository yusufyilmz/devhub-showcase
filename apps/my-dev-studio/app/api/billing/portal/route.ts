import { portal } from "@shared/billing/server";

import { billingPost } from "@/features/admin/handler";

export function POST(request: Request) {
  return billingPost(request, portal);
}
