// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { preparePreviewFrame } from "./frame";
import { previewDocument } from "./styles";

describe("private preview frame", () => {
  afterEach(() => {
    document.head.querySelector("[data-test-preview]")?.remove();
    delete document.documentElement.dataset.theme;
  });

  it("copies styles without injecting draft data or changing the host theme", () => {
    const style = document.createElement("style");
    style.dataset.testPreview = "";
    style.textContent = "h1 { font-weight: 700; }";
    document.head.append(style);
    document.documentElement.dataset.theme = "light";
    const doc = new DOMParser().parseFromString(previewDocument, "text/html");
    preparePreviewFrame(doc, { accent: "violet", defaultTheme: "dark", theme: "studio" });
    expect(doc.documentElement.dataset.theme).toBe("dark");
    expect(doc.documentElement.dataset.accent).toBe("violet");
    expect(doc.head.textContent).toContain("font-weight: 700");
    expect(doc.querySelectorAll("script")).toHaveLength(0);
    expect(doc.body.textContent).toBe("");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("supports existing appearance defaults and refreshes styles without accumulating copies", () => {
    const doc = new DOMParser().parseFromString(previewDocument, "text/html");
    preparePreviewFrame(doc, undefined);
    const count = doc.head.children.length;
    document.documentElement.dataset.theme = "dark";
    preparePreviewFrame(doc, undefined);
    expect(doc.head.children).toHaveLength(count);
    expect(doc.documentElement.dataset.portfolioTheme).toBe("studio");
    expect(doc.documentElement.dataset.theme).toBe("dark");
    expect(doc.documentElement.dataset.accent).toBe("cyan");
  });
});
