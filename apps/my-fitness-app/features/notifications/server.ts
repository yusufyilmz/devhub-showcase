import { createFitnessNotificationHandlers } from "@shared/lib/fitness-notification-handlers";

import { env } from "@/env";
import { fitnessUser, requestIdentity, sameOrigin } from "@/lib/auth";

export const { pushConfiguration, notificationRequest, testNotification, dispatchReminders } =
  createFitnessNotificationHandlers({
    configuration: () => ({
      cronSecret: env.CRON_SECRET,
      privateKey: env.WEB_PUSH_PRIVATE_KEY,
      publicKey: env.WEB_PUSH_PUBLIC_KEY,
      subject: env.WEB_PUSH_SUBJECT,
    }),
    identify: async (request) => fitnessUser((await requestIdentity(request)).user)?.id ?? null,
    sameOrigin,
  });
