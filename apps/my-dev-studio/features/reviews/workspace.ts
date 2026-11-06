import { cvPath } from "@shared/lib/profiles";

import { requireAdmin } from "@/features/admin/admin-auth";

export const portfolioReviewPath = (username: string) => `${cvPath(username)}/review`;

// Legacy referral records belong to the main portfolio and have no per-profile key.
export async function reviewWorkspace() {
  const { client, repository } = await requireAdmin();
  const portfolio = await repository.read();
  return portfolio?.username ? { client, username: portfolio.username } : null;
}
