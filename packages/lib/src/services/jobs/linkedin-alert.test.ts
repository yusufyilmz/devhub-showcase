import { describe, expect, it } from "vitest";

import { extractLinkedInAlert } from "./linkedin-alert";

describe("forwarded LinkedIn alerts", () => {
  it("canonicalizes tracked URLs and deduplicates text and HTML", () => {
    const jobs = extractLinkedInAlert(
      "https://www.linkedin.com/jobs/view/123/?trk=weekly",
      '<a href="https://www.linkedin.com/comm/jobs/view/123?trk=abc&amp;x=2"><b>Engineer</b> &amp; Lead</a>',
    );
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.listing).toEqual({
      sourceId: "123",
      title: "Engineer & Lead",
      url: "https://www.linkedin.com/jobs/view/123/",
    });
  });

  it("accepts direct job URLs only and leaves an unknown title blank", () => {
    expect(
      extractLinkedInAlert(
        [
          "https://www.linkedin.com.evil.test/jobs/view/123",
          "https://www.linkedin.com@evil.test/jobs/view/123",
          "https://www.linkedin.com/jobs/search/?currentJobId=123",
          "https://www.linkedin.com/jobs/view/engineer-at-example-456/",
        ].join("\n"),
        "",
      ).map(({ listing }) => listing),
    ).toEqual([{ sourceId: "456", title: "", url: "https://www.linkedin.com/jobs/view/456/" }]);
  });
});
