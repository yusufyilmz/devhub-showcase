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
    <svg
      aria-hidden="true"
      className="agent-avatar [width:100%] [height:100%] [overflow:visible] [transform-origin:center_80%] motion-safe:[animation:agent-float_3.6s_ease-in-out_infinite] motion-safe:[[data-agent='fitness']_&]:[animation-name:agent-bounce] motion-safe:[[data-agent='portfolio']_&]:[animation-name:agent-tilt]"
      viewBox="0 0 88 88"
    >
      {agent === "studio" && (
        <g className="agent-accent [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round]">
          <path d="M44 21V12" />
          <circle cx="44" cy="9" r="3" />
        </g>
      )}
      {agent === "portfolio" && (
        <path
          className="agent-accent [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round]"
          d="M13 34V23h11m40 0h11v11M13 51v11h11m40 0h11V51"
        />
      )}
      {agent === "fitness" && (
        <path
          className="agent-accent [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round]"
          d="M9 41h8m54 0h8M11 35v12m66-12v12"
        />
      )}
      <rect
        className="agent-body [fill:var(--agent-body)] [stroke:var(--agent-accent)] [stroke-width:2]"
        height="22"
        rx="10"
        width="36"
        x="26"
        y="55"
      />
      <path
        className="agent-limbs [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:4]"
        d="m29 60-7 7M36 74v5m16-5v5"
      />
      <rect
        className="agent-body [fill:var(--agent-body)] [stroke:var(--agent-accent)] [stroke-width:2]"
        height="40"
        rx="17"
        width="54"
        x="17"
        y="20"
      />
      <rect
        className="agent-face [fill:var(--agent-face)]"
        height="27"
        rx="11"
        width="42"
        x="23"
        y="27"
      />
      <g className="agent-eyes [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke:var(--agent-eye)] [transform-origin:center] [transform-box:fill-box] motion-safe:[animation:agent-blink_5.4s_ease-in-out_infinite]">
        <path d={eyePaths[activity ?? "idle"]} />
      </g>
      {activity === "thinking" && (
        <g className="agent-thoughts [fill:var(--agent-eye)] [stroke:var(--agent-accent)] [stroke-width:2] [stroke-linecap:round]">
          <circle cx="66" cy="21" r="2" />
          <circle cx="73" cy="15" r="3" />
          <circle cx="81" cy="8" r="4" />
        </g>
      )}
      {activity === "writing" && (
        <path
          className="agent-pencil [fill:var(--agent-eye)] [stroke:var(--agent-face)] [stroke-width:2] [stroke-linejoin:round] [transform-origin:60px_58px]"
          d="m62 58 10 13m-12-13 3-2 11 14-4 2Z"
        />
      )}
      {activity === "happy" && (
        <path
          className="agent-spark [fill:var(--agent-eye)] [stroke:var(--agent-accent)] [stroke-width:2] [stroke-linecap:round]"
          d="M73 22v10m-5-5h10"
        />
      )}
      {activity === "error" && (
        <path
          className="agent-eyes [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke:var(--agent-eye)] [transform-origin:center] [transform-box:fill-box] motion-safe:[animation:agent-blink_5.4s_ease-in-out_infinite]"
          d="M38 49q6-5 12 0"
        />
      )}
      {agent === "studio" && (
        <path
          className="agent-mark [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke:var(--agent-face)] [stroke-width:2]"
          d="m35 64 4 3-4 3m9 0h8"
        />
      )}
      {agent === "portfolio" && (
        <path
          className="agent-mark [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke:var(--agent-face)] [stroke-width:2]"
          d="M38 64h12m-12 5h8"
        />
      )}
      {agent === "fitness" && (
        <path
          className="agent-mark [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke:var(--agent-face)] [stroke-width:2]"
          d="M33 67h5l3-4 4 8 3-4h7"
        />
      )}
      <path
        className="agent-limbs [fill:none] [stroke:var(--agent-accent)] [stroke-width:3] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:4] agent-arm motion-safe:[[data-agent='studio [max-width:1160px] [padding:var(--studio-top,_36px)_40px_var(--studio-bottom,_80px)] [margin:auto] max-[767px]:[padding:var(--studio-top,_20px)_18px_var(--studio-bottom,_50px)] [&.studio-editor]:[max-width:none] [padding:0_32px_96px_0] max-[767px]:[&.studio-editor]:[padding:20px_16px_104px] [--studio-bottom:0px]']_&]:[transform-origin:59px_60px]"
        d="m59 60 7 7"
      />
    </svg>
  );
}
