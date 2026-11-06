export type AgentNotice = {
  id: string;
  message: string;
  title: string;
  announce?: boolean;
  action?: { href: string; label: string };
};

export type AgentCompanionProps = {
  agent: "studio" | "portfolio" | "fitness";
  className?: string;
  label: string;
  notice?: AgentNotice;
  placement?: "floating" | "inline";
} & ({ href: string; onOpen?: never } | { href?: never; onOpen: () => void });
