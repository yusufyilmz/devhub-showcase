import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTask } from "@shared/services/types";

import { starterWorkspace } from "@/features/task-workspace/starter";

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  generate: vi.fn(),
  limit: vi.fn(),
  load: vi.fn(),
  save: vi.fn(),
}));
vi.mock("@/features/task-workspace/server", () => ({
  SetupRequired: class extends Error {},
  SignInRequired: class extends Error {},
  workspaceContext: mocks.context,
}));
vi.mock("@/lib/auth", () => ({
  sameOrigin: (req: Request) => req.headers.get("origin") === origin,
}));
vi.mock("@shared/assistant/fitness", () => ({ proposeFitnessChange: mocks.generate }));
vi.mock("@shared/cache", () => ({ allowFitnessAssistant: mocks.limit }));

import { SignInRequired } from "@/features/task-workspace/server";

import { POST } from "./route";

const origin = "https://fitness.example";
function request(input: object = {}, requestOrigin = origin) {
  return new Request(`${origin}/api/assistant`, {
    body: JSON.stringify({
      goal: "Only mornings",
      mode: "FITNESS",
      planId: "gym",
      revision: 2,
      ...input,
    }),
    headers: { origin: requestOrigin },
    method: "POST",
  });
}

describe("Fitness assistant route", () => {
  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "fixture");
    vi.stubEnv("REDIS_URL", "fixture");
    vi.stubEnv("REDIS_TOKEN", "fixture");
    const state = starterWorkspace();
    state.tasks.push(
      createTask({ id: "gym", kind: "gym", title: "Movement plan" }),
      createTask({ id: "workout", kind: "workout", parentId: "gym", title: "Walk" }),
      createTask({ id: "other", kind: "gym", title: "Other plan" }),
    );
    mocks.context.mockResolvedValue({
      service: { load: mocks.load, save: mocks.save },
      userId: "owner",
    });
    mocks.load.mockResolvedValue({ revision: 2, state });
    mocks.limit.mockResolvedValue(true);
    mocks.generate.mockResolvedValue({
      suggestions: [{ notes: "", title: "Warm up" }],
      summary: "Draft",
    });
  });

  it("sends only the selected plan, using the signed-in workspace and without saving", async () => {
    expect((await POST(request({ workspaceId: "other-user" }))).status).toBe(200);
    expect(mocks.load).toHaveBeenCalledWith("owner");
    expect(mocks.generate).toHaveBeenCalledWith(
      "FITNESS",
      {
        goal: "Only mornings",
        plan: { kind: "gym", notes: "", title: "Movement plan" },
        remainingTasks: 0,
        tasks: [{ kind: "workout", title: "Walk" }],
      },
      expect.any(AbortSignal),
    );
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("rejects stale revisions, tasks outside the plan, and attempts over the limit", async () => {
    expect((await POST(request({ revision: 1 }))).status).toBe(409);
    expect((await POST(request({ mode: "NOTIFICATIONS", taskId: "other" }))).status).toBe(404);
    mocks.limit.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(429);
    expect(mocks.generate).not.toHaveBeenCalled();
  });

  it("scopes workout and edit requests to the selected plan", async () => {
    expect((await POST(request({ mode: "TASK_EDIT", taskId: "other" }))).status).toBe(404);
    expect(
      (await POST(request({ mode: "WORKOUT", planId: "everyday-meals", taskId: "everyday-meals" })))
        .status,
    ).toBe(404);
    expect(mocks.generate).not.toHaveBeenCalled();

    expect((await POST(request({ mode: "WORKOUT", taskId: "workout" }))).status).toBe(200);
    expect(mocks.generate).toHaveBeenCalledWith(
      "WORKOUT",
      {
        children: [],
        goal: "Only mornings",
        task: { kind: "workout", notes: "", targetReps: null, title: "Walk" },
      },
      expect.any(AbortSignal),
    );
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("rejects foreign origins and unauthenticated requests", async () => {
    expect((await POST(request({}, "https://other.example"))).status).toBe(403);
    expect(mocks.context).not.toHaveBeenCalled();
    mocks.context.mockRejectedValueOnce(new SignInRequired());
    expect((await POST(request())).status).toBe(401);
    expect(mocks.load).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
  });
});

// Keep per-test configuration mutable; production schemas are validated separately.
vi.mock("../../../env", () => ({ env: process.env }));
