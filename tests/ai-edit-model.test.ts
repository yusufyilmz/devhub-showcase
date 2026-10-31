import { expect, it, vi } from "vitest";

import { PortfolioEditModel } from "../packages/chat/src/models/portfolio-edit-model";
import { profile } from "../packages/content/src/index";
import { buildOwnerPortfolioKnowledge } from "../packages/lib/src/domain/portfolio-knowledge";

it("uses bounded structured output and validates the response without tools or storage", async () => {
  const create = vi.fn().mockResolvedValue({
    output_text: JSON.stringify({
      changes: [{ field: "title", reason: "Requested", value: '"Engineer"' }],
      summary: "Shorten title",
    }),
    status: "completed",
  });
  const model = new PortfolioEditModel({
    responses: { create },
  } as unknown as ConstructorParameters<typeof PortfolioEditModel>[0]);
  const knowledge = buildOwnerPortfolioKnowledge({
    id: "alpha",
    profile,
    revision: 1,
    updatedAt: "",
    username: "alex",
  });
  expect((await model.propose(knowledge, "Shorten my title")).changes[0]?.field).toBe("title");
  expect(create.mock.calls[0]?.[0]).toMatchObject({
    max_output_tokens: 12000,
    store: false,
    text: { format: { strict: true, type: "json_schema" } },
  });
  expect(create.mock.calls[0]?.[0].tools).toBeUndefined();
  expect(create.mock.calls[0]?.[0].input[0].content).toContain("fieldContract");
  create.mockResolvedValue({ output_text: "{}", status: "incomplete" });
  await expect(model.propose(knowledge, "Change theme")).rejects.toThrow("Incomplete");
  create.mockResolvedValue({
    output_text: '{"summary":"x","changes":[{"field":"isPublic","value":"true","reason":"x"}]}',
    status: "completed",
  });
  await expect(model.propose(knowledge, "Publish")).rejects.toThrow();
});
