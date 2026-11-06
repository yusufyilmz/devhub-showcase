import { HomePage as HomeComposition, type PageAction } from "@shared/ui/sections";

import { ExampleCarousel, StudioPlanDetails } from "@/features/studio";

export function HomePage({
  action,
  exampleHref,
}: {
  action: PageAction;
  exampleHref: string | null;
}) {
  return (
    <HomeComposition
      action={action}
      exampleHref={exampleHref}
      examples={<ExampleCarousel />}
      planDetails={<StudioPlanDetails />}
    />
  );
}
