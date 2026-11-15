import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderCv } from "@shared/assistant/cv";
import { profile } from "@shared/config";
import { readPublicProfile, readPublishedProfile } from "@shared/lib/published-profile";

import generator from "./config";

vi.mock("node:fs", () => ({ existsSync: vi.fn(() => false) }));
vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(),
  readFile: vi.fn(async () => "fixture template"),
  writeFile: vi.fn(),
}));
vi.mock("@shared/lib/published-profile", () => ({
  readPublicProfile: vi.fn(),
  readPublishedProfile: vi.fn(),
}));
vi.mock("@shared/assistant/cv", () => ({ cvHelpers: {}, renderCv: vi.fn() }));

type CvAction = (answers: Record<string, unknown>) => Promise<string>;
function cvAction(): CvAction {
  const setGenerator = vi.fn((_name: string, definition: unknown) => definition);
  const plop = {
    renderString: vi.fn((source: string) => source),
    setGenerator,
    setHelper: vi.fn(),
  };
  generator(plop as unknown as Parameters<typeof generator>[0]);
  const definition = setGenerator.mock.calls.find(([name]) => name === "cv")?.[1] as {
    actions: CvAction[];
  };
  const action = definition.actions[0];
  if (!action) throw new Error("CV action was not registered");
  return action;
}

describe("CV generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(readPublishedProfile).mockResolvedValue({ profile, revision: 7, updatedAt: "" });
    vi.mocked(readPublicProfile).mockResolvedValue(null);
    vi.mocked(renderCv).mockResolvedValue(Buffer.from("fixture PDF"));
  });
  it("reads the published CV surface and current template path", async () => {
    const action = cvAction();
    await expect(action({})).resolves.toContain("revision 7");
    expect(readPublishedProfile).toHaveBeenCalledWith("cv");
    expect(readFile).toHaveBeenCalledWith(
      resolve("packages/assistant/templates/cv.json.hbs"),
      "utf8",
    );
    expect(renderCv).toHaveBeenCalledWith(profile, "fixture template", expect.any(Function));
    expect(writeFile).toHaveBeenCalledWith(resolve("output/cv.pdf"), Buffer.from("fixture PDF"), {
      flag: "wx",
    });
  });
  it("rejects a missing or private named CV without falling back to another profile", async () => {
    await expect(cvAction()({ profileId: "private-fixture" })).rejects.toThrow(
      "does not exist or is private",
    );
    expect(readPublicProfile).toHaveBeenCalledWith("private-fixture", "cv");
    expect(readPublishedProfile).not.toHaveBeenCalled();
    expect(renderCv).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });
  it("preserves existing PDF output files", async () => {
    vi.mocked(existsSync).mockImplementation((file) => String(file).endsWith("existing.pdf"));
    await expect(cvAction()({ output: "output/existing.pdf" })).rejects.toThrow(
      "File already exists",
    );
    expect(writeFile).not.toHaveBeenCalled();
  });
});
