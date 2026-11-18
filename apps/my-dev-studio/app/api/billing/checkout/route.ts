import { checkout } from "@shared/billing/server";

import { billingPost } from "@/services/admin/get-billing";

export function POST(request: Request) {
  return billingPost(request, checkout);
}
