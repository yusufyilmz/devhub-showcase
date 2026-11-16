import { HomeChatLauncher } from "@shared/assistant/chat/launcher";
import { ExampleCarousel } from "@shared/assistant/examples";
import { StudioCompanion } from "@shared/assistant/studio-companion";
import { StudioPlanDetails } from "@shared/billing/components";
import { HomePage } from "@shared/ui/sections";

import { getAccountMenu } from "./_account-menu";
import { getHomeAction, getHomeExample } from "./_home-links";
export default async function Page() {
  const [action, exampleHref] = await Promise.all([getHomeAction(), getHomeExample()]);
  return (
    <>
      <HomePage
        accountMenu={await getAccountMenu({ action })}
        action={action}
        chatLauncher={<HomeChatLauncher />}
        exampleHref={exampleHref}
        examples={<ExampleCarousel />}
        planDetails={<StudioPlanDetails />}
      />
      <StudioCompanion signedIn={action.signedIn} />
    </>
  );
}
