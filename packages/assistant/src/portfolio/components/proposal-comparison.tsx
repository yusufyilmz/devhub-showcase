import "./workflow.css";

import type { ProposalComparisonProps } from "./types";

function readable(value: unknown): string {
  if (value === undefined || value === null || value === "") return "Not set";
  if (Array.isArray(value)) return value.length ? value.map(readable).join("\n\n") : "No items";
  if (typeof value === "object")
    return Object.entries(value)
      .map(([key, entry]) => `${key.replace(/([A-Z])/g, " $1")}: ${readable(entry)}`)
      .join("\n");
  return String(value);
}
export function ProposalComparison({ before, after }: ProposalComparisonProps) {
  return (
    <div className="editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]">
      <div>
        <strong>Current value</strong>
        <p className="proposal-value [max-height:16rem] [overflow:auto] [font-size:14px] [line-height:1.6] [overflow-wrap:anywhere] [white-space:pre-wrap]">
          {readable(before).slice(0, 6000)}
        </p>
      </div>
      <div>
        <strong>Suggested value</strong>
        <p className="proposal-value [max-height:16rem] [overflow:auto] [font-size:14px] [line-height:1.6] [overflow-wrap:anywhere] [white-space:pre-wrap]">
          {readable(after).slice(0, 6000)}
        </p>
      </div>
      <details>
        <summary>Compare before and after</summary>
        <p>Before · full data</p>
        <pre className="ai-profile-json [max-height:34rem] [padding:1rem] [overflow:auto] [font-size:0.8rem] [overflow-wrap:anywhere] [white-space:pre-wrap]">
          {JSON.stringify(before, null, 2)}
        </pre>
        <p>Proposed · full data</p>
        <pre className="ai-profile-json [max-height:34rem] [padding:1rem] [overflow:auto] [font-size:0.8rem] [overflow-wrap:anywhere] [white-space:pre-wrap]">
          {JSON.stringify(after, null, 2)}
        </pre>
      </details>
    </div>
  );
}
