# Sandbox billing, assignment, quota and readiness screens

**Scope/status:** Sandbox integration; billing-reliability roadmap remains separate.

**Prerequisites:** Use Stripe test configuration only, a disposable account and signed test webhooks. No live payment keys.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                        | Route path       | Action                                                                                                             | Expected result                                                                                            | Actual result / evidence                                                                |
| ---- | ---------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1    | [Open](https://mydevstudio.vercel.app/admin/billing) | `/admin/billing` | Inspect Free/Pro status, configured test price, assignment and separate assistant allowances.                      | Status and readiness explain the actual account state without granting access from a checkout return URL.  | Not run                                                                                 |
| 2    | [Open](https://mydevstudio.vercel.app/admin/billing) | `/admin/billing` | Use test checkout/portal in a configured sandbox; return and Refresh status after the signed test webhook.         | Verified server state determines access; refresh itself creates no payment/model request or usage attempt. | Not run                                                                                 |
| 3    | [Open](https://mydevstudio.vercel.app/admin/billing) | `/admin/billing` | Assign the eligible portfolio and enable/disable portfolio AI chat.                                                | Private assistant and visitor opt-in remain separate, with publication/allowance checks.                   | Not run                                                                                 |
| 4    | [Open](https://mydevstudio.vercel.app/admin/billing) | `/admin/billing` | Use fixtures for missing configuration, exhausted allowance and a failed portal/provider operation.                | Safe errors and recovery actions appear; no quota or authorization bypass occurs.                          | Not run                                                                                 |
| 5    | [Open](https://mydevstudio.vercel.app/admin/billing) | `/admin/billing` | Open Subscription settings at desktop and mobile widths. Use Appearance controls to switch between light and dark. | The settings panel, plan headings, and usage bars remain readable, with no horizontal scrolling.           | Local browser fixtures passed in light and dark at both widths. Hosted preview not run. |

## Related evidence and detail

- [e2e/admin/billing/billing.spec.ts](../../../apps/my-dev-studio/e2e/admin/billing/billing.spec.ts)
- [docs/features/stripe-billing.md](../../../docs/features/stripe-billing.md)

Return to the [manual testing index](index.md).
