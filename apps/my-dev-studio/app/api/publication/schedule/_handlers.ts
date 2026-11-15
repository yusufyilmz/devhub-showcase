import { createPublicationSchedule } from "@shared/lib/publication-schedule";

import { env } from "@/env";
import { requireWorkspace, sameOrigin } from "@/features/admin/admin-auth";
import { managedRepository } from "@/features/management/managed-portfolios";

export const { publicationSchedule } = createPublicationSchedule({
  sameOrigin,
  schedulerConfigured: () =>
    Boolean(env.CRON_SECRET && env.CRON_SECRET.length >= 32 && env.SUPABASE_SERVICE_ROLE_KEY),
  workspace: (id) => (id ? managedRepository(id) : requireWorkspace()),
});
