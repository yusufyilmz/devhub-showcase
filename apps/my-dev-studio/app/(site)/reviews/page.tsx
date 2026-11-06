import { notFound, redirect } from "next/navigation";

import { portfolioReviewPath, reviewWorkspace } from "@/features/reviews/workspace";

export default async function ReviewsRedirect() {
  const workspace = await reviewWorkspace().catch(() => redirect("/login"));
  if (!workspace) notFound();
  redirect(portfolioReviewPath(workspace.username));
}
