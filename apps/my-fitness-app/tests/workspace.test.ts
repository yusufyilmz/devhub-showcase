import assert from "node:assert/strict";

import { afterEach, test, vi } from "vitest";

import { makeDay } from "@shared/lib/db/migrations/v1-model";
import { seedWorkspace } from "@shared/lib/db/seed";
import { convertV1Workspace } from "@shared/lib/migrations/convert-v1-workspace";
import { seed } from "@shared/lib/migrations/v1-seed";
import {
  type BaseWorkspaceRepository,
  InvalidWorkspaceError,
  RevisionConflictError,
  WorkspaceService,
} from "@shared/lib/workspace";

import { DemoWorkspaceGateway, HttpWorkspaceGateway } from "../features/task-workspace/gateway";

afterEach(() => vi.unstubAllGlobals());
test("demo uses fictional data without calling the workspace API", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const gateway = new DemoWorkspaceGateway();
  const result = await gateway.load();
  assert.equal(result.state.settings.name, "Sam");
  assert.equal(gateway.readOnly, true);
  await assert.rejects(gateway.save(), /read-only/);
  assert.equal(fetcher.mock.calls.length, 0);
});
test("server-verified owner permissions unlock the live gateway", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        canEdit: true,
        revision: 3,
        state: seedWorkspace(),
        workspaceId: "fixture-owner",
      }),
    )
    .mockResolvedValueOnce(Response.json({ revision: 4 }));
  vi.stubGlobal("fetch", fetcher);
  const gateway = new HttpWorkspaceGateway(async () => ({
    Authorization: "Bearer owner-token",
  }));
  assert.equal(gateway.readOnly, true);
  const { state } = await gateway.load();
  assert.equal(gateway.readOnly, false);
  assert.equal(await gateway.save(state, 3), 4);
  const request = fetcher.mock.calls[1]?.[1];
  assert.equal(request?.headers.Authorization, "Bearer owner-token");
  assert.equal(JSON.parse(request?.body).workspaceId, "fixture-owner");
});
test("service validation and authenticated owner identity cross the repository boundary", async () => {
  const calls: string[] = [];
  const repo: BaseWorkspaceRepository = {
    load: async (id) => {
      calls.push(id);
      return { revision: 0, state: seedWorkspace() };
    },
    save: async (id, _, rev) => {
      calls.push(id);
      return rev + 1;
    },
  };
  const service = new WorkspaceService(repo);
  await service.load("owner-a");
  assert.equal(await service.save("owner-a", { revision: 2, state: seedWorkspace() }), 3);
  assert.throws(() => service.save("owner-a", { revision: 2, state: {} }), InvalidWorkspaceError);
  assert.deepEqual(calls, ["owner-a", "owner-a"]);
});
test("service propagates revision conflicts without retrying stale writes", async () => {
  const repo: BaseWorkspaceRepository = {
    load: async () => ({ revision: 4, state: seedWorkspace() }),
    save: async () => {
      throw new RevisionConflictError();
    },
  };
  await assert.rejects(
    new WorkspaceService(repo).save("owner-a", {
      revision: 3,
      state: seedWorkspace(),
    }),
    RevisionConflictError,
  );
});
test("existing JSON migration preserves meal status, actual set logs, water and weights", () => {
  const v1 = seed();
  const d = "2026-10-19";
  v1.days[d] = makeDay(v1, d);
  v1.days[d].status["y1-breakfast"] = "done";
  v1.days[d].sets["hip-abduction-machine:0"] = {
    done: true,
    reps: 20,
    weight: 55,
  };
  v1.days[d].water = 250;
  v1.weights.push({ date: d, value: 85 });
  const next = convertV1Workspace(v1);
  assert.equal(next.tasks.find((t) => t.id === `day:${d}:y1-breakfast`)?.status, "done");
  const set = next.tasks.find((t) => t.id === `day:${d}:w1:hip-abduction-machine:set:0`)!;
  assert.equal(set.details.type === "set" && set.details.weightKg, 55);
  assert.equal(set.status, "done");
  assert.equal(next.weights[0]?.value, 85);
  assert.ok(
    next.tasks.some(
      (t) => t.id.endsWith(":extra-water") && t.details.type === "water" && t.details.ml === 250,
    ),
  );
});
