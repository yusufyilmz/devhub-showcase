import { checkout } from "@shared/billing/server";

import { billingPost } from "@/features/admin/handler";
import { monitored } from "@/features/platform/operation-monitoring";

function post(request: Request) {
  return billingPost(request, checkout);
}

export const POST = monitored("billing.checkout", post);
