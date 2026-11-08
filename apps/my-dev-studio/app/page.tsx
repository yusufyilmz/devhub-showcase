import { ExampleCarousel } from "@shared/assistant/examples";
import { HomePage } from "@shared/assistant/sections";
import { StudioCompanion } from "@shared/assistant/studio-companion";
import { StudioPlanDetails } from "@shared/billing/components";

import { getHomeAction, getHomeExample } from "./_home-links";

export default async function Page() {
  const [action, exampleHref] = await Promise.all([getHomeAction(), getHomeExample()]);
  return (
    <>
      <HomePage
        action={action}
        exampleHref={exampleHref}
        examples={<ExampleCarousel />}
        planDetails={<StudioPlanDetails />}
      />
      <StudioCompanion signedIn={action.signedIn} />
    </>
  );
}
