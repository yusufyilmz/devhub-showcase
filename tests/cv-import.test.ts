import { describe, expect, it, vi } from "vitest";

import { CvImportModel } from "../packages/chat/src/models/cv-import-model";
import { profile } from "../packages/content/src/profile";
import { MAX_CV_BYTES, validateCvFile } from "../packages/lib/src/domain/cv-file";
import {
  applyCvDraft,
  createCvDraft,
  cvExtractionJsonSchema,
  cvExtractionSchema,
  cvReviewNotes,
} from "../packages/lib/src/domain/cv-import";
import { validateProfile } from "../packages/lib/src/domain/profile";
import { extractedCv } from "./cv-import-fixture";

describe("CV extraction and reviewed drafts", () => {
  it("creates fresh identities for career items while preserving portfolio configuration", () => {
    const base = validateProfile(profile);
    const candidate = createCvDraft(base, extractedCv);
    expect(candidate.name).toBe("Alex Rivera");
    expect(candidate.experiences[0]).toMatchObject({
      companyUrl: "",
      end: null,
      start: "2022-03-01",
    });
    expect(candidate.education[0]?.start).toBe("2015-01-01");
    expect(candidate.projects[0]?.public).toBe(false);
    expect(candidate.projects[0]?.id).not.toBe(createCvDraft(base, extractedCv).projects[0]?.id);
    expect(validateProfile(candidate)).toMatchObject({ name: "Alex Rivera" });
    const applied = applyCvDraft(base, candidate, ["personal", "experiences"]);
    expect(applied.projects).toEqual(
      base.projects.map((project) => ({ ...project, experienceId: null })),
    );
    expect(applied.appearance).toEqual(base.appearance);
    expect(applied.cvSettings).toEqual(base.cvSettings);
    expect(applied.customSections).toEqual(base.customSections);
    expect(cvReviewNotes(extractedCv).join(" ")).toContain("Partial dates");
  });
  it("leaves unselected groups unchanged and does not invent missing dates or websites", () => {
    const base = validateProfile(profile);
    const result = {
      ...extractedCv,
      experiences: [{ ...extractedCv.experiences[0]!, ongoing: false, start: null }],
      name: null,
    };
    const candidate = createCvDraft(base, result);
    expect(candidate.name).toBe(base.name);
    expect(candidate.experiences[0]?.start).toBe("");
    expect(candidate.experiences[0]?.end).toBe("");
    expect(applyCvDraft(base, candidate, []).experiences).toEqual(base.experiences);
    expect(() => validateProfile(candidate)).toThrow();
    expect(
      cvExtractionSchema.safeParse({ ...extractedCv, website: "javascript:alert(1)" }).success,
    ).toBe(false);
    expect(cvExtractionSchema.safeParse({ ...extractedCv, owner_id: "other" }).success).toBe(false);
  });
  it("accepts supported file signatures and bounds raw file sizes", async () => {
    const pdf = await validateCvFile(new File(["%PDF-1.7\nCV"], "personal.pdf"));
    expect(pdf).toMatchObject({ filename: "cv.pdf", mime: "application/pdf" });
    const docx = await validateCvFile(
      new File([new Uint8Array([80, 75, 3, 4, 1])], "personal.docx"),
    );
    expect(docx.filename).toBe("cv.docx");
    expect(
      (
        await validateCvFile(
          new File(["A professional curriculum vitae with experience"], "cv.txt"),
        )
      ).mime,
    ).toBe("text/plain");
    await expect(validateCvFile(new File(["hello"], "fake.pdf"))).rejects.toThrow(
      "matching file format",
    );
    await expect(
      validateCvFile(new File([new Uint8Array(MAX_CV_BYTES + 1)], "cv.pdf")),
    ).rejects.toThrow("3 MB");
    await expect(
      validateCvFile(new File([new Uint8Array([255, 254, 0, 1])], "cv.txt")),
    ).rejects.toThrow("UTF-8");
  });
  it("sends isolated file input with structured output, no tools, retries or response storage", async () => {
    const create = vi
      .fn()
      .mockResolvedValue({ output_text: JSON.stringify(extractedCv), status: "completed" });
    expect(JSON.stringify(cvExtractionJsonSchema)).not.toContain('"format":"uri"');
    const model = new CvImportModel({ responses: { create } } as unknown as ConstructorParameters<
      typeof CvImportModel
    >[0]);
    const file = await validateCvFile(new File(["%PDF-1.7\nCV"], "private-name.pdf"));
    expect((await model.extract(file)).name).toBe("Alex Rivera");
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      max_output_tokens: 12000,
      reasoning: { effort: "none" },
      store: false,
      text: { format: { strict: true, type: "json_schema" } },
    });
    expect(create.mock.calls[0]?.[0].input[0].content[1]).toMatchObject({
      filename: "cv.pdf",
      type: "input_file",
    });
    expect(create.mock.calls[0]?.[0].tools).toBeUndefined();
    create.mockResolvedValue({ output_text: "", status: "incomplete" });
    await expect(model.extract(file)).rejects.toThrow("completely");
    create.mockResolvedValue({
      output_text: JSON.stringify({ ...extractedCv, isCv: false }),
      status: "completed",
    });
    await expect(model.extract(file)).rejects.toThrow("readable CV");
  });
});
