import { AgentCompanion } from "@shared/ui/agent-companion";
import { HomePage as HomeComposition, type PageAction } from "@shared/ui/sections";

import { studioHomeGuide } from "@/features/companion/guides";
import { ExampleCarousel, StudioPlanDetails } from "@/features/studio";

export function HomePage({
  action,
  exampleHref,
}: {
  action: PageAction;
  exampleHref: string | null;
}) {
  return (
    <>
      <HomeComposition
        action={action}
        exampleHref={exampleHref}
        examples={<ExampleCarousel />}
        planDetails={<StudioPlanDetails />}
      />
      {action.signedIn && (
        <AgentCompanion
          agent="studio"
          guide={studioHomeGuide}
          href="/admin/chat"
          label="Open Studio assistant"
        />
      )}
    </>
  );
}
