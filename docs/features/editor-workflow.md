# Guided editing, recovery and AI review

New owners choose a profession and layout, then import or enter details, and review their portfolio before saving or publishing. Back and manual-entry controls keep the current draft. The full editor remains available at every stage. Existing portfolios open directly in the editor.

## Draft recovery

Recovery autosaves after 500 ms of inactivity and flushes pending work on page exit or editor navigation. It uses `sessionStorage`, scoped to the signed-in user and portfolio ID, with a maximum record size of 250,000 characters and a 24-hour expiry. It preserves the draft, username, selected visibility, editing tab, profession choice and setup step. No draft is sent to a server by autosave, and no public page or CV changes until the user explicitly saves.

On return, the owner can inspect, restore or discard recoverable work. Incomplete text, dates and URLs can be recovered; structural types and allowed enum values are checked before restoration. Invalid or expired records are removed. Browser storage failures remain visible with a retry action; the editor continues holding changes in memory. The existing unsaved-changes warning remains enabled.

Recovery belongs to the current browser tab and is not a cross-device backup. Signing out clears this tab's recovery records. Closing a tab normally clears its storage, although browser session restoration may retain it until expiry. Owners using shared devices should sign out explicitly.

Successful explicit saves clear the previous recovery and announce only the new revision number to other open tabs through `BroadcastChannel` where supported. A tab that learns of a newer save disables saving. Reloading retrieves the server version; a recovery based on an older revision can be inspected and discarded but cannot be applied over it. Copy any desired changes from the read-only recovery review into the current draft. Across devices, the existing server revision check remains authoritative and rejects conflicting saves; there is no automatic merge or retry over a newer revision.

## AI review

Proposals start with no accepted fields. Owners accept individual fields or explicitly accept all; rejecting all disables Apply. Current and suggested values appear as readable text, with full data available under Compare before and after. Large summaries are shortened to 6,000 characters; full data remains available.

A proposal must match the requested saved revision. A changed draft or revision invalidates an existing proposal. Unsupported fields, malformed values and changes to private project publication remain rejected by the existing shared validator. Applying changes only the local draft and supports undo. Saving remains separate; there are no new provider requests or billing rules.

## Verification

`e2e/edit/editor-workflow.spec.ts` exercises profession/layout choice, manual entry, failed import, reload recovery, back navigation, review and a conflicting second-tab save on desktop Chromium and Pixel 7 emulation. AI editor and studio chat browser tests explicitly accept proposed fields before application. Colocated unit tests cover recovery expiry, malformed records, incomplete input, retry, page-exit flushing, sign-out stopping, mixed AI decisions and stale revisions. Tests use synthetic accounts and intercepted provider responses.

The main-only, non-blocking browser workflow remains unchanged. No new environment variables or migrations are required. Production smoke checks remain a separate step after merge and deployment.
