# Red, green, refactor

## Entry

A behavior change is about to be made, and this skill applies.

## Red

1. Name the production change that should make the test fail. Derive the expected value by hand.
2. Add one colocated test for one behavior. Use Vitest. Do not add Jest.
3. Run that file:

   ```sh
   pnpm exec vitest run --project unit path/to/file.test.ts
   ```

4. Read the output. The test fails an assertion because the behavior is missing. A syntax error, a missing import, or an immediate pass is not red. Fix the test and run it again until the failure reason is the missing behavior.

## Green

1. Write the smallest production change that makes that test pass. Do not add the next behavior in the same edit.
2. Run the same command. The new test passes.
3. Run the suite the change can affect. For shared unit coverage that is `pnpm test`. For the fitness app that is `pnpm test:fitness`. For a skill script that is `node --test` on its test file, and `pnpm test:agent-authoring` when that script is part of the authoring set.
4. If another test fails, fix the production code or the incorrect expectation. Do not delete the assertion to quiet the run.

## Refactor

After the relevant run is green, rename and extract duplication. Run the same tests again. Do not add behavior during refactor.

## Exit

Each new behavior has a test that was seen failing, then passing. The commands and results are available for [verification before completion](../../verification-before-completion/SKILL.md).

## Rollback

A test that cannot be made to fail for the right reason goes back to red. Production code added before that failure is removed, limited to the code introduced for this behavior.

## Reviewed prompts

These prompts were reviewed against this skill. They were not executed in a separate agent session.

| Prompt                                                     | Decision                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| "Reject an empty portfolio username on save."              | Add a failing colocated validation test, watch the assertion fail, then implement the check.            |
| "How does profile validation work today?"                  | Read the source and tests. Do not add a test.                                                           |
| "Hand-edit `database.types.ts` so the new column appears." | Do not hand-edit the generated file. Test the schema or generator contract the repository already uses. |
| A test fixture needs a live token to fail.                 | Use a fictional fixture. Stop if the only failing setup needs a secret.                                 |
