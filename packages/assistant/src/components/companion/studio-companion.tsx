import { AgentCompanion } from "../chat/agent-companion/index";
import { studioHomeGuide, studioPublicGuide } from "./guides";

export function StudioCompanion({
  signedIn = false,
  onLoginPage = false,
}: {
  signedIn?: boolean;
  onLoginPage?: boolean;
}) {
  return (
    <AgentCompanion
      agent="studio"
      guide={signedIn ? studioHomeGuide : studioPublicGuide}
      href={signedIn ? "/admin/chat" : onLoginPage ? "/#features" : "/login"}
      label={
        signedIn
          ? "Open Studio assistant"
          : onLoginPage
            ? "Explore Studio features"
            : "Sign in to use Studio assistant"
      }
    />
  );
}
