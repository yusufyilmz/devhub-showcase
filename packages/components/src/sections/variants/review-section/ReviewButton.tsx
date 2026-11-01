"use client";

import { useRouter } from "next/navigation";

import { copy } from "@shared/config";
import { ReviewState, type ReviewWithReferrals } from "@shared/lib/types";
import { useNotification } from "@shared/runtime/notifications";
import { Button } from "@shared/ui/button";

export const ReviewButton = ({
  handleReview,
  id,
}: {
  id: string;
  handleReview: (id: string, status: ReviewState) => Promise<ReviewWithReferrals | undefined>;
}) => {
  const { showError, showInfo } = useNotification();
  const router = useRouter();
  const onReview = async (id: string, status: ReviewState): Promise<void> => {
    try {
      const createdReferral = await handleReview(id, status);

      if (createdReferral === undefined) {
        throw new Error("Error approving referral");
      }

      let notifier: ((name: string) => string) | undefined;

      if (status === ReviewState.APPROVED) {
        notifier = copy.notifications.success.referralApproved;
      } else if (status === ReviewState.REJECTED) {
        notifier = copy.notifications.success.referralRejected;
      }

      if (notifier) {
        showInfo(notifier(createdReferral.referral?.name ?? ""));
      }

      router.refresh();
    } catch (_e) {
      showError(copy.notifications.errors.referralApproveError);
    }
  };

  return (
    <div className="flex w-full gap-4">
      <Button
        aria-label="Reject"
        className="w-full"
        onClick={() => onReview(id, ReviewState.REJECTED)}
        variant="outline"
      >
        Reject
      </Button>
      <Button
        aria-label="Approve"
        className="w-full"
        onClick={() => onReview(id, ReviewState.APPROVED)}
        variant="outline"
      >
        Approve
      </Button>
    </div>
  );
};
