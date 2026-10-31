import { expect, it } from "vitest";

import { profile } from "../packages/content/src/index";
import { applyAiEdit, validateAiEdit } from "../packages/lib/src/domain/ai-edit";
import { validateProfile } from "../packages/lib/src/domain/profile";

const draft = validateProfile(profile);
it("applies selected validated changes without mutating the original", () => {
  const proposal = {
    changes: [
      {
        field: "title" as const,
        reason: "Concise role",
        value: JSON.stringify("Frontend engineer"),
      },
      {
        field: "appearance" as const,
        reason: "Requested accent",
        value: JSON.stringify({ ...draft.appearance, accent: "violet" }),
      },
    ],
    summary: "Refine introduction",
  };
  const before = JSON.stringify(draft);
  const next = applyAiEdit(draft, proposal, ["title"]);
  expect(next.title).toBe("Frontend engineer");
  expect(next.appearance).toEqual(draft.appearance);
  expect(JSON.stringify(draft)).toBe(before);
});
it("rejects unsupported fields, duplicated changes and unsafe values", () => {
  const change = { field: "title", reason: "Requested", value: '"Engineer"' };
  for (const field of ["username", "owner_id", "isPublic", "email", "__proto__"]) {
    expect(() =>
      validateAiEdit(draft, { changes: [{ ...change, field }], summary: "x" }),
    ).toThrow();
  }
  expect(() => validateAiEdit(draft, { changes: [change, change], summary: "x" })).toThrow();
  expect(() =>
    validateAiEdit(draft, { changes: [{ ...change, value: '{"wrong":true}' }], summary: "x" }),
  ).toThrow();
});
it("preserves private project visibility and blocks publishing new projects", () => {
  const projects = [{ ...draft.projects[0]!, public: false }];
  const source = { ...draft, projects };
  expect(() =>
    validateAiEdit(source, {
      changes: [
        {
          field: "projects",
          reason: "Publish",
          value: JSON.stringify([{ ...projects[0], public: true }]),
        },
      ],
      summary: "x",
    }),
  ).toThrow("publication");
  expect(() =>
    validateAiEdit(source, {
      changes: [
        {
          field: "projects",
          reason: "New",
          value: JSON.stringify([...projects, { ...projects[0], id: "new", public: true }]),
        },
      ],
      summary: "x",
    }),
  ).toThrow("publication");
});
it("rejects invalid combined relationships and accepts clarification with no changes", () => {
  expect(() =>
    validateAiEdit(draft, {
      changes: [{ field: "experiences", reason: "Remove", value: "[]" }],
      summary: "x",
    }),
  ).toThrow();
  expect(applyAiEdit(draft, { changes: [], summary: "Which role should I add?" })).toEqual(draft);
});
