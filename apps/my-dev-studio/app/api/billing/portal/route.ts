import { portal } from "@shared/billing/server";

import { billingPost } from "@/features/admin/handler";
import { monitored } from "@/features/platform/operation-monitoring";

function post(request: Request) {
  return billingPost(request, portal);
}

export const POST = monitored("billing.portal", post);
