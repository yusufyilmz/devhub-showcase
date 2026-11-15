"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { EmptyState } from "@shared/ui/empty-state";

import { ReviewButton } from "./ReviewButton";
import { reviewSectionStyles as styles } from "./styles";
import type { ReviewSectionProps } from "./types";

const reviewDate = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });

export function ReviewSection({ reviews, handleReview }: ReviewSectionProps) {
  const router = useRouter();
  const [refreshing, refresh] = useTransition();

  return (
    <section aria-labelledby="review-queue-heading">
      <header className="editor-section-heading mb-5 flex flex-wrap items-center justify-between gap-4 max-[767px]:items-start [&_h2]:my-1 [&_h2]:mb-2 [&_h2]:text-[clamp(1.375rem,2.6vw,1.875rem)] [&_h2]:leading-[1.17] [&_h2]:font-[670] [&_h2]:tracking-[-0.035em] [&_p:not(.eyebrow)]:max-w-[62ch] [&_p:not(.eyebrow)]:text-[0.9375rem] [&_p:not(.eyebrow)]:leading-normal [&_p:not(.eyebrow)]:text-muted-foreground">
        <div>
          <h2 id="review-queue-heading">Testimonial reviews</h2>
          <p>
            Approve testimonials to show them on your portfolio, or reject them to keep them
            private.
          </p>
        </div>
        {reviews && (
          <Badge role="status" variant="secondary">
            {reviews.length} pending
          </Badge>
        )}
      </header>
      {reviews === null ? (
        <div role="alert">
          <EmptyState
            className={styles.empty}
            description="Refresh the queue to try loading your testimonials again."
            height="auto"
            title="Couldn’t load reviews"
          >
            <Button
              disabled={refreshing}
              onClick={() => refresh(() => router.refresh())}
              type="button"
              variant="outline"
            >
              {refreshing ? "Refreshing…" : "Refresh queue"}
            </Button>
          </EmptyState>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          className={styles.empty}
          description="New testimonials will appear here when they’re ready for review."
          height="auto"
          title="You’re all caught up"
        />
      ) : (
        <ul className="grid list-none gap-4 p-0 lg:grid-cols-2">
          {reviews.map(({ id, createdAt, updatedAt, referral }) => {
            const name = referral?.name || "Anonymous reviewer";
            return (
              <li className="min-w-0" key={id}>
                <Card className={styles.card} interaction="static" layout="plain">
                  <div className="grid flex-1 content-start gap-4 p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <div className="min-w-0 break-words">
                        <h3 className="text-base font-semibold">{name}</h3>
                        {referral?.relationship && (
                          <p className={styles.label}>{referral.relationship}</p>
                        )}
                      </div>
                      <time className={styles.label} dateTime={createdAt}>
                        {reviewDate.format(new Date(createdAt))}
                      </time>
                    </div>
                    {referral?.feedback && (
                      <div>
                        <p className={styles.label}>Feedback</p>
                        <p className={styles.quote}>{referral.feedback}</p>
                      </div>
                    )}
                    {referral?.recommendation && (
                      <div>
                        <p className={styles.label}>Recommendation</p>
                        <p className={styles.quote}>{referral.recommendation}</p>
                      </div>
                    )}
                    {!referral?.feedback && !referral?.recommendation && (
                      <p className={styles.label}>No written feedback yet.</p>
                    )}
                  </div>
                  <ReviewButton
                    handleReview={handleReview}
                    id={id}
                    key={updatedAt}
                    name={name}
                    updatedAt={updatedAt}
                  />
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
