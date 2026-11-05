import { describe, expect, it } from "vitest";

import { ChatRole } from "@shared/lib/types";

import { summarizeQuestions } from "./index";

describe("summarizeQuestions", () => {
  it("keeps recent visitor questions in order within the history budget", () => {
    const history = summarizeQuestions(
      [
        { content: "old".repeat(2500), role: ChatRole.User },
        { content: "What did you build?", role: ChatRole.User },
        { content: "A portfolio.", role: ChatRole.Assistant },
        { content: "How did you test it?", role: ChatRole.User },
      ],
      "gpt-4.1-mini",
    );

    expect(history).toBe("Previously asked: What did you build?\nHow did you test it?");
  });
});
