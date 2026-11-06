"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ReviewState } from "@shared/lib/types";
import { useNotification } from "@shared/runtime/notifications";

import { Button } from "../../buttons/button";
import type { ReviewButtonOptions } from "./types";

export function ReviewButton({ handleReview, id, name, updatedAt }: ReviewButtonOptions) {
  const { showInfo } = useNotification();
  const router = useRouter();
  const [saving, setSaving] = useState<ReviewState>();
  const [error, setError] = useState("");

  async function decide(state: ReviewState) {
    setSaving(state);
    setError("");
    const result = await handleReview(id, state, updatedAt).catch(() => "error");
    if (result === "error") {
      setError("Couldn’t save your decision. Try again.");
      setSaving(undefined);
      return;
    }

    showInfo(
      result === "conflict"
        ? "This review changed. The queue has been refreshed."
        : state === ReviewState.APPROVED
          ? "Testimonial approved."
          : "Testimonial rejected.",
    );
    router.refresh();
  }

  return (
    <div className="grid gap-2 border-t border-border bg-muted/30 px-5 py-3 sm:px-6">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          aria-label={`Reject testimonial from ${name}`}
          className="studio-secondary"
          disabled={Boolean(saving)}
          onClick={() => decide(ReviewState.REJECTED)}
          type="button"
          variant="outline"
        >
          {saving === ReviewState.REJECTED ? "Rejecting…" : "Reject"}
        </Button>
        <Button
          aria-label={`Approve testimonial from ${name}`}
          className="studio-primary"
          disabled={Boolean(saving)}
          onClick={() => decide(ReviewState.APPROVED)}
          type="button"
        >
          {saving === ReviewState.APPROVED ? "Approving…" : "Approve"}
        </Button>
      </div>
    </div>
  );
}
