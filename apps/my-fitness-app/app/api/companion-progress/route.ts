import {
  companionProgressHandlers,
  type FeatureProgressDatabase,
} from "@shared/lib/companion-progress";

import { fitnessUser, requestIdentity, sameOrigin } from "@/lib/auth";

export const { GET, POST } = companionProgressHandlers({
  app: "fitness",
  async identify(request) {
    const { client, user } = await requestIdentity<FeatureProgressDatabase>(request);
    return { client, user: fitnessUser(user) };
  },
  sameOrigin,
});
