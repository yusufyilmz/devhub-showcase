export const billingMessages = {
  busy: "Another billing update is in progress. Wait a moment, refresh status and try again.",
  existing_subscription:
    "You already have a subscription. Use Manage subscription instead of starting another checkout.",
  no_subscription:
    "No Stripe billing profile is linked yet. Use Try Pro checkout to start a sandbox subscription. A demo grant does not create a Stripe subscription.",
  not_configured:
    "Sandbox billing setup is incomplete. Contact the site administrator before trying again.",
  sign_in_required: "Your session has expired. Sign in again before opening billing.",
  unavailable:
    "Billing could not be reached. Refresh status and try again. If you recently completed checkout, wait for Stripe confirmation before retrying.",
};
export type BillingErrorCode = keyof typeof billingMessages;
export class BillingActionError extends Error {
  constructor(readonly code: BillingErrorCode) {
    super(billingMessages[code]);
  }
}
export function billingErrorMessage(code: unknown) {
  return typeof code === "string" && Object.hasOwn(billingMessages, code)
    ? billingMessages[code as BillingErrorCode]
    : billingMessages.unavailable;
}
