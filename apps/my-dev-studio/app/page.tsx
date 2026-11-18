import { HomeChatLauncher } from "@shared/assistant/chat/launcher";
import { ExampleCarousel } from "@shared/assistant/examples";
import { StudioCompanion } from "@shared/assistant/studio-companion";
import { StudioPlanDetails } from "@shared/billing/components";

import { getAccountMenu } from "@/services/home/get-account-menu";
import { getHomeAction, getHomeExample } from "@/services/home/get-home-links";
import { HomePage } from "@/views/home/HomePage";

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
