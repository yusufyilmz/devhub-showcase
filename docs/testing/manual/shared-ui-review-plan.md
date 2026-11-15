# Shared UI review plan

Use this plan to continue the component polish already underway. The [review inventory](shared-ui-inventory.md) tracks component families and their stories. The [review notes](shared-ui-styles.md) record actions and observed results.

## 1. Start from current main

1. Read the [repository instructions](../../../AGENTS.md) and confirm the checkout and working tree with `git rev-parse --show-toplevel` and `git status --short --branch`.
2. Fetch `origin/main` and compare it with your current commit. Preserve local work and start from the latest main. If local and remote commits diverge, review both sides before integrating them.
3. Choose a pending family from the inventory. Check the existing review notes first. Some pending rows already have older evidence that needs confirmation against current main. Tag is a starting point if it still needs a current pass after Badge and Chip.

## 2. Review the component and its callers

1. Read the component, styles, public exports, stories, and representative callers. Use the [UI catalog](../../../packages/ui/CATALOG.md) and [package exports](../../../packages/ui/package.json) to find primitives and parts that the inventory groups on one row.
2. Use the closest Once UI reference. Start with the [component overview](https://docs.once-ui.com/components/overview), [foundations](https://docs.once-ui.com/basics), [modules](https://docs.once-ui.com/modules), or [blocks](https://docs.once-ui.com/blocks/quickStart). Record the specific example that informed the review.
3. If a component has no dedicated story, find a composition that renders it and record the story and how to exercise the component. Add a focused story when the existing examples cannot expose a relevant state.

## 3. Make the smallest coherent change

1. Preserve the current folders, public imports, props, Storybook routes, and existing behavior. Reuse shared primitives, Tailwind utilities, and semantic theme tokens. Keep custom CSS for behavior or visuals that the shared utilities cannot express cleanly.
2. Prefer soft one-pixel borders, clear hierarchy, and visible keyboard focus. Use the shared Compact, Comfortable, and Spacious spacing presets where padding or gaps should respond to density. Preserve useful control heights and keep older spacing links and saved preferences working.
3. Make purposeful changes per component. If its styling already fits, record the reason and verify the applicable states.

## 4. Verify the rendered states

1. Start Storybook with `pnpm storybook`. Use the story itself or its iframe preview to check the rendered component. Record the actual story and settings used.
2. Check Sand light and dark at 320px and a representative desktop width. Spot-check a second palette such as Cyan or White. Compare spacing presets when changing density. Look for horizontal overflow, clipped focus, illegible labels, and borders or fills that are hard to distinguish.
3. Exercise the applicable states with the pointer and keyboard. Check default, hover, focus, disabled, selected, open or closed, error, loading, and reduced motion where relevant. Use real keyboard input for focus and activation. Confirm a consuming composition still works when shared styles change.
4. Run focused tests if behavior could regress. Use `git diff --check` and let the normal repository hooks run. Record the exact checks that ran and any checks left pending. The standalone Verify run was waived for this work.

## 5. Record and publish

1. Update the inventory row with the result and a link to the evidence. In the review notes, capture the story route, reference, palette, mode, viewport, actions, and observed result. Keep untested parts and states visible as pending.
2. Commit in small, coherent batches. The current delivery instruction is to push directly to `main`. Fetch again before publishing and use a normal fast-forward push. Confirm GitHub main contains the expected commit.
3. Continue through the inventory. Before calling the review complete, reconcile the checklist with current exports and stories, account for grouped parts and unlisted components, and resolve or report every pending check.
