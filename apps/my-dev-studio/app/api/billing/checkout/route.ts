import { checkout } from "@shared/billing/server";

import { billingPost } from "@/features/admin/handler";

export function POST(request: Request) {
  return billingPost(request, checkout);
}
