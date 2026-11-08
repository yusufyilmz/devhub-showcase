import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { StudioHeading } from "@shared/assistant/portfolio";
import { ReviewSection } from "@shared/assistant/sections";
import { ReviewService } from "@shared/lib/studio";
import { logger } from "@shared/utils/logger";

import { requireAdmin } from "@/features/admin/admin-auth";

import { handleSubmitReviewAction } from "../../actions";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Portfolio reviews",
};

async function reviewWorkspace() {
  const { client, repository } = await requireAdmin();
  const portfolio = await repository.read();
  return portfolio?.username ? { client, username: portfolio.username } : null;
}

export default async function PortfolioReviewPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const workspace = await reviewWorkspace().catch(() => redirect("/login"));
  if (!workspace || workspace.username !== username) notFound();

  const reviews = await new ReviewService(logger, workspace.client)
    .getPendingReviews()
    .catch(() => {
      logger.error("Error fetching pending portfolio reviews");
      return null;
    });

  return (
    <main className="studio" id="admin-content">
      <StudioHeading
        description="Review referrals submitted for your portfolio."
        eyebrow="Portfolio moderation"
        title="Pending reviews"
      />
      {reviews ? (
        <ReviewSection
          handleReview={async (reviewId, status, updatedAt) => {
            "use server";
            const result = await handleSubmitReviewAction(reviewId, status, updatedAt);
            return result ? "saved" : "error";
          }}
          reviews={reviews}
        />
      ) : (
        <p className="editor-card" role="alert">
          Couldn’t load your reviews. Refresh to try again.
        </p>
      )}
    </main>
  );
}
