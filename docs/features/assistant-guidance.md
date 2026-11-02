# Focused assistant tools

Tasks 18, 20 and 21 add owner writing tools, section feedback and published visitor sources.

## Owner workflow

In the editor AI assistant, choose general editing, selected writing or portfolio quality review. Writing supports the summary, one project description or one experience’s achievements, with tone and length choices. Only the selected text and its short identifying context go to the writing provider. The server reconstructs the change from the original draft, retaining other records, IDs and privacy flags. New or missing numeric facts and URLs are rejected. This guard cannot prove semantic factual accuracy: review names and claims before accepting.

Feedback identifies a section, issue, recommendation and whether more facts are needed. Supported edits use the existing individual selection, reject, apply and undo workflow. Navigating to a field does not apply a change. Apply updates the local draft; Save changes remains explicit. Existing ownership, revision, entitlement and reserved-attempt billing checks apply. Invalid or empty writing selections fail before reserving an attempt.

## Visitor boundaries

Source links come from the public projection, not provider-generated URLs. Hidden sections and private projects remain excluded. Links use the actual section anchors for the portfolio layout. General classification and referral paths remain intact.

Each request reads the current published snapshot without caching. Non-streaming portfolio and premium answers recheck publication after generation and reject changed or withdrawn snapshots. Streaming retains its request-start snapshot policy; delivered text cannot be retracted. Existing history and source links on an already-open page refresh on reload. A withdrawn portfolio cannot start a new permitted request.

## Configuration

No new environment variables or migrations. Existing OpenAI editor model, API key, saved-agent and entitlement configuration is reused. Saved agent instructions should support focused rewriting and section feedback; task intent is also included in the request input. Writing uses a strict text-only JSON object; general editing and feedback use the existing proposal contract with a feedback array. Old proposals without feedback remain accepted.

The implementation follows the official [Responses structured output guide](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses). Provider calls are simulated in automated tests; live agent behavior, quota consumption and billing require configured test accounts.

## Manual checks

Use a disposable account, replace `test-owner`, and use these same paths on the PR preview host. AI generation needs enabled entitlement, remaining attempts and provider configuration. These are instructions, not claims of a live production test.

| Step | Clickable URL                                                 | Route path         | Action                                                                                                  | Expected result                                                                                   |
| ---- | ------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1    | [Open editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Choose AI assistant, Improve selected writing, Summary, Friendly and Concise; generate.                 | A review appears; nothing is applied or saved.                                                    |
| 2    | [Open editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Accept the summary, apply, then Undo AI changes. Repeat for one project or experience.                  | Only the selected field changes; undo restores it and other records remain intact.                |
| 3    | [Open editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Choose Review portfolio quality and generate. Reject all edits, then use a feedback Edit button.        | Issues distinguish missing facts; applying is disabled after rejection; navigation does not save. |
| 4    | [Open billing](https://mydevstudio.vercel.app/admin/billing)  | `/admin/billing`   | Inspect allowance before and after generation with a configured test plan.                              | Reserved attempts follow existing billing rules; status reads consume no attempts.                |
| 5    | [Open portfolio](https://mydevstudio.vercel.app/test-owner)   | `/test-owner`      | Open enabled visitor chat, follow a Published portfolio sources link and ask an unsupported question.   | Links target visible sections; unsupported facts are acknowledged.                                |
| 6    | [Open editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Hide a section or withdraw the disposable portfolio and save, then retry visitor chat in the other tab. | New requests use current publication permissions; reload updates displayed source links.          |

Automated fixture flow: `pnpm exec playwright test e2e/edit/assistant-tools.spec.ts`. It runs on desktop and mobile with simulated provider responses and no paid requests.
