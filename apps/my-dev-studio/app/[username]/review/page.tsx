import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ReviewService } from "@shared/services/studio";
import { StudioHeading } from "@shared/ui/portfolio";
import { ReviewSection } from "@shared/ui/sections";
import { logger } from "@shared/utils/logger";

import { reviewWorkspace } from "@/features/reviews/workspace";

import { handleSubmitReviewAction } from "../../actions";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Portfolio reviews",
};

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
