// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { discoverPageSections } from "./sections";

describe("page section discovery", () => {
  it("keeps authored ids and order, skips hidden sections and headings owned by nested sections", () => {
    document.body.innerHTML =
      '<main><section id="intro"><h1>Introduction</h1><p>Welcome</p></section><section><div><section id="work"><h2>Work</h2></section></div></section><section hidden><h2>Private</h2></section></main><footer><section><h2>Footer</h2></section></footer>';
    const original = HTMLElement.prototype.getClientRects;
    HTMLElement.prototype.getClientRects = function () {
      return (this.hidden ? [] : [{}]) as unknown as DOMRectList;
    };
    try {
      expect(discoverPageSections()).toEqual([
        { description: "Welcome", id: "intro", title: "Introduction" },
        { description: undefined, id: "work", title: "Work" },
      ]);
    } finally {
      HTMLElement.prototype.getClientRects = original;
      document.body.innerHTML = "";
    }
  });
});
