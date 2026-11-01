// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card semantic composition", () => {
  afterEach(cleanup);
  it("preserves article semantics and forwards its accessible name", () => {
    render(
      <Card asChild interaction="lift" layout="plain" surface="portfolio">
        <article aria-label="Selected project">
          <a href="/demo">Project</a>
        </article>
      </Card>,
    );
    const article = screen.getByRole("article", { name: "Selected project" });
    expect(article.dataset.slot).toBe("card");
    expect(article.parentElement?.querySelectorAll("article")).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
