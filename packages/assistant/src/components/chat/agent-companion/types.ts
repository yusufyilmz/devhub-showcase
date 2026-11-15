export type AgentNotice = {
  id: string;
  message: string;
  title: string;
  announce?: boolean;
  action?: { href: string; label: string };
};

export type AgentActivity = "idle" | "listening" | "thinking" | "writing" | "happy" | "error";

export type AgentCompanionProps = {
  activity?: AgentActivity;
  agent: "studio" | "portfolio" | "fitness";
  className?: string;
  label: string;
  guide?: AgentGuide;
  notice?: AgentNotice;
  placement?: "floating" | "inline" | "composer";
} & (
  | { href: string; onOpen?: never }
  | { href?: never; onOpen: () => void }
  | { placement: "composer"; href?: never; onOpen?: never }
);

export type AgentFeature = {
  id: string;
  group: string;
  title: string;
  message: string;
  context?: string;
  action?: AgentNotice["action"] | { label: string; onSelect: () => void };
};

export type AgentGuide = {
  id: string;
  title: string;
  features: readonly AgentFeature[];
  suggestions?: readonly AgentFeature[];
  followUps?: readonly AgentFeature[];
  context?: string;
  paused?: boolean;
  progressHref?: string;
  progressRequest?: typeof fetch;
  observed?: readonly string[];
};
