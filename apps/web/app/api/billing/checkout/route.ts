import { checkout } from "@/lib/billing/gateway";
import { billingPost } from "@/lib/billing/handler";
export function POST(request: Request) {
  return billingPost(request, checkout);
}
