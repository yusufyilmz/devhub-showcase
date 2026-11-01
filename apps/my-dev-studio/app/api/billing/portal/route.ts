import { portal } from "@/features/billing/gateway";
import { billingPost } from "@/features/billing/handler";

export function POST(request: Request) {
  return billingPost(request, portal);
}
