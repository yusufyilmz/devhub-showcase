import { HomePage as HomeComposition, type PageAction } from "@shared/ui/sections";

import { StudioCompanion } from "@/features/companion/studio-companion";
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
      <StudioCompanion signedIn={action.signedIn} />
    </>
  );
}
