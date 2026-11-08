import type { AgentCompanionProps } from "./types";

const eyePaths = {
  error: "m31 39 7 3m12 0 7-3",
  happy: "M31 40q4 5 8 0m10 0q4 5 8 0",
  idle: "M31 40q4 5 8 0m10 0q4 5 8 0",
  listening: "M35 37v5m18-5v5",
  thinking: "M30 37h8m12 3h8",
  writing: "M35 37v5m18-5v5",
};

export function AgentAvatar({ agent, activity }: Pick<AgentCompanionProps, "agent" | "activity">) {
  return (
    <svg aria-hidden="true" className="agent-avatar" viewBox="0 0 88 88">
      {agent === "studio" && (
        <g className="agent-accent">
          <path d="M44 21V12" />
          <circle cx="44" cy="9" r="3" />
        </g>
      )}
      {agent === "portfolio" && (
        <path className="agent-accent" d="M13 34V23h11m40 0h11v11M13 51v11h11m40 0h11V51" />
      )}
      {agent === "fitness" && (
        <path className="agent-accent" d="M9 41h8m54 0h8M11 35v12m66-12v12" />
      )}
      <rect className="agent-body" height="22" rx="10" width="36" x="26" y="55" />
      <path className="agent-limbs" d="m29 60-7 7M36 74v5m16-5v5" />
      <rect className="agent-body" height="40" rx="17" width="54" x="17" y="20" />
      <rect className="agent-face" height="27" rx="11" width="42" x="23" y="27" />
      <g className="agent-eyes">
        <path d={eyePaths[activity ?? "idle"]} />
      </g>
      {activity === "thinking" && (
        <g className="agent-thoughts">
          <circle cx="66" cy="21" r="2" />
          <circle cx="73" cy="15" r="3" />
          <circle cx="81" cy="8" r="4" />
        </g>
      )}
      {activity === "writing" && (
        <path className="agent-pencil" d="m62 58 10 13m-12-13 3-2 11 14-4 2Z" />
      )}
      {activity === "happy" && <path className="agent-spark" d="M73 22v10m-5-5h10" />}
      {activity === "error" && <path className="agent-eyes" d="M38 49q6-5 12 0" />}
      {agent === "studio" && <path className="agent-mark" d="m35 64 4 3-4 3m9 0h8" />}
      {agent === "portfolio" && <path className="agent-mark" d="M38 64h12m-12 5h8" />}
      {agent === "fitness" && <path className="agent-mark" d="M33 67h5l3-4 4 8 3-4h7" />}
      <path className="agent-limbs agent-arm" d="m59 60 7 7" />
    </svg>
  );
}
