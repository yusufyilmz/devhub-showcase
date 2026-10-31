import assert from "node:assert/strict";
import { test } from "node:test";

import { expandDemoSections } from "./demo-sections.mjs";
import { assertEmptyDemoAccount, seedDemo } from "./seed-demo.mjs";

const user = {
  email_confirmed_at: "2026-01-01",
  id: "owner",
  identities: [{ provider: "google" }],
};
const starter = {
  document: { experiences: [], projects: [], templateChosen: false },
  id: "profile",
  is_public: false,
  owner_id: "owner",
  revision: 1,
};
test("only a verified empty owned Google workspace is eligible", () => {
  assert.doesNotThrow(() => assertEmptyDemoAccount(user, starter, null));
  for (const row of [
    { ...starter, is_public: true },
    { ...starter, revision: 2 },
    { ...starter, id: "main" },
    { ...starter, owner_id: "other" },
    { ...starter, document: { ...starter.document, templateChosen: true } },
  ])
    assert.throws(() => assertEmptyDemoAccount(user, row, null));
  assert.throws(() => assertEmptyDemoAccount({ ...user, email_confirmed_at: null }, starter, null));
  assert.throws(() => assertEmptyDemoAccount(user, starter, {}));
});
test("dry-run does not write or grant access", async () => {
  let writes = 0;
  const client = {
    auth: { admin: { getUserById: async () => ({ data: { user }, error: null }) } },
    from: (table) => {
      const query = {
        eq: () => query,
        maybeSingle: async () => ({
          data: table === "portfolio_profiles" ? starter : null,
          error: null,
        }),
        select: () => query,
        update: () => {
          writes++;
          throw new Error("unexpected write");
        },
      };
      return query;
    },
  };
  assert.equal((await seedDemo(client, "owner")).mode, "dry-run");
  assert.equal(writes, 0);
});

test("expanding the library preserves content and ordering and is idempotent", () => {
  const profile = {
    customSections: [],
    hero: { kind: "image", url: "https://example.com/hero.png" },
    sectionSequence: ["about"],
  };
  const expanded = expandDemoSections(profile);
  assert.deepEqual(profile.customSections, []);
  assert.deepEqual(expanded.hero, profile.hero);
  assert.equal(expanded.sectionSequence[0], "about");
  assert.equal(
    new Set(expanded.customSections.map((s) => s.id)).size,
    expanded.customSections.length,
  );
  assert.deepEqual(expandDemoSections(expanded), expanded);
});
