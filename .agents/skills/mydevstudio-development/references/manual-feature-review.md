# Manual feature review and Notion evidence

Use these requirements for UI, API, permissions, provider integration and workflow changes. Consult the [manual testing index](../../../../docs/testing/manual/index.md) and [guide template](../../../../docs/testing/manual/template.md).

For every new or changed feature, add or update a dedicated guide under [`docs/testing/manual/`](../../../../docs/testing/manual/index.md) and its entry in the [manual testing index](../../../../docs/testing/manual/index.md), in the same PR as the feature. This applies to UI, API, permission, integration and workflow behavior. Do not consider a feature ready for review without this documentation.

Use the [guide template](../../../../docs/testing/manual/template.md). Each feature guide must identify scope/status, account/fixture/configuration prerequisites and numbered steps. **Every step must contain a clickable full URL, the matching route path, the exact action/control, expected result and actual result/evidence.** Tabs use the real parent page route; never invent routes for tabs. Include persistence, failure/retry/conflict and owner/other-user/signed-out or public/private checks where applicable.

When a roadmap task has a reviewable implementation, add or update its Notion **How to test** section using the dedicated guide: clickable URLs, route paths, prerequisites, actions, expected results, actual evidence and PR/guide links. Preserve task requirements and do not mark deployed verification complete from local tests. If Notion access or workspace limits block the update, record the pending task links and do not repeatedly retry an entitlement failure.

Use disposable accounts and fictional content. Distinguish preview/local/manual/provider/deployed verification; leave unexecuted steps **Not run** and mark blocked prerequisites explicitly. Partial features must state what is unfinished. Never claim live integration or production migration verification from fixtures or a green CI run. Link each feature guide in the PR's per-feature testing section and maintain older instructions when behavior changes.
