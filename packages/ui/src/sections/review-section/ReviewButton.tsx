"use client";

import { useRouter } from "next/navigation";

import { copy } from "@shared/config";
import { ReviewState } from "@shared/lib/types";
import { useNotification } from "@shared/runtime/notifications";

import { Button } from "../../buttons/button";
import { reviewButtonStyles } from "./styles";
import type { ReviewButtonOptions } from "./types";

export const ReviewButton = ({ handleReview, id }: ReviewButtonOptions) => {
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
    <div className={reviewButtonStyles.element1}>
      <Button
        aria-label="Reject"
        className={reviewButtonStyles.element2}
        onClick={() => onReview(id, ReviewState.REJECTED)}
        variant="outline"
      >
        Reject
      </Button>
      <Button
        aria-label="Approve"
        className={reviewButtonStyles.element3}
        onClick={() => onReview(id, ReviewState.APPROVED)}
        variant="outline"
      >
        Approve
      </Button>
    </div>
  );
};
