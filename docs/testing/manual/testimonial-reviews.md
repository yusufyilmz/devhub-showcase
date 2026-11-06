# Testimonial reviews

**Scope/status**

The owner of the original portfolio can approve or reject visitor testimonials from the Reviews tab of the profile editor. Decisions take effect independently of CV draft saves.

**Prerequisites**

Use a disposable preview containing this change and the `protect_portfolio_reviews` migration. Configure the preview’s server-side Supabase service-role key for legacy testimonial intake and public display. Use a confirmed account that owns the preview’s `main` profile, a separate confirmed workspace account, and two pending fictional testimonials. For the intake step, configure legacy portfolio chat in the preview.

Use the [shared setup and result rules](index.md#before-you-start). Replace the example hostname and usernames with the matching preview.

**Manual result**

Preview verification pending.

| Step | Clickable URL                                                                         | Route path          | Action                                                                                                                                                       | Expected result                                                                                                      | Actual result / evidence                                                            |
| ---- | ------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1    | [Original portfolio](https://mydevstudio.vercel.app/test-owner)                       | `/test-owner`       | Complete a fictional referral in legacy portfolio chat.                                                                                                      | The entry appears in the owner’s review queue and stays off the public portfolio while pending.                      | Preview not run. Local migration test verifies that intake queues a pending review. |
| 2    | [Legacy reviews link](https://mydevstudio.vercel.app/reviews)                         | `/reviews`          | Open the link as the original owner and inspect the queue at desktop and mobile widths.                                                                      | The link opens the editor’s **Reviews** tab with the pending count and both actions.                                 | Local browser fixture passed. Preview not run.                                      |
| 3    | [Owner editor](https://mydevstudio.vercel.app/test-owner/edit?tab=reviews)            | `/test-owner/edit`  | Click **Approve** on the first card and **Reject** on the second, then reload.                                                                               | Each decision removes its card. The empty state remains after reload.                                                | Local browser and migration tests passed. Preview not run.                          |
| 4    | [Original portfolio](https://mydevstudio.vercel.app/test-owner)                       | `/test-owner`       | Open the published page in a signed-out window.                                                                                                              | The approved testimonial appears. The rejected testimonial stays private.                                            | Local browser fixture passed. Preview not run.                                      |
| 5    | [Owner editor](https://mydevstudio.vercel.app/test-owner/edit?tab=reviews)            | `/test-owner/edit`  | Interrupt an **Approve** request, then restore the connection and retry. For a separate entry, decide in one tab and try the opposite action in a stale tab. | A request failure keeps the card available to retry. The stale tab refreshes without overwriting the first decision. | Local browser retry and database stale-write checks passed. Preview not run.        |
| 6    | [Other workspace editor](https://mydevstudio.vercel.app/other-owner/edit?tab=reviews) | `/other-owner/edit` | Open your own editor as the separate account and look for **Reviews**.                                                                                       | The editor opens without the moderation tab.                                                                         | Preview not run. Local route and migration tests verify account isolation.          |
| 7    | [Legacy reviews link](https://mydevstudio.vercel.app/reviews)                         | `/reviews`          | Visit while signed out.                                                                                                                                      | Sign-in opens without exposing any review details.                                                                   | Local browser fixture passed. Preview not run.                                      |

## Related checks

- [Browser scenario](../../../e2e/edit/testimonial-reviews.spec.ts)
- [Local database permissions and decision checks](../../../packages/lib/src/supabase/rls/portfolio-reviews.test.ts)
