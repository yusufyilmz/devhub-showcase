import { type BillingErrorCode, billingMessages } from "@shared/lib/billing";

export { type BillingErrorCode, billingErrorMessage, billingMessages } from "@shared/lib/billing";

export class BillingActionError extends Error {
  constructor(readonly code: BillingErrorCode) {
    super(billingMessages[code]);
  }
}
