// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProposalComparison } from "./proposal-comparison";

describe("proposal comparison", () => {
  afterEach(cleanup);
  it("shows prose, empty values and collections without interpreting suggested HTML", () => {
    render(
      <ProposalComparison
        after={[{ name: "<script>private suggestion</script>" }]}
        before={undefined}
      />,
    );
    expect(screen.getByText("Not set")).toBeDefined();
    expect(screen.getByText("name: <script>private suggestion</script>")).toBeDefined();
    expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText("Compare before and after")).toBeDefined();
  });
});
