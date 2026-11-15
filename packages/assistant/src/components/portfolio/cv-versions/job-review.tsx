"use client";
import { useState } from "react";

import { suggestCvEvidence, tailorCvVariant } from "@shared/lib/profiles";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";

import { JobInterviewPrep } from "./job-interview-prep";
import type { CvJobReviewProps } from "./types";
export function CvJobReview({
  variant,
  onCreate,
  disabled,
  requestInterviewPrep,
}: CvJobReviewProps) {
  const [job, setJob] = useState("");
  const [review, setReview] = useState<ReturnType<typeof suggestCvEvidence> | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const choices = review?.filter((item) => selected.includes(`${item.field}:${item.id}`)) ?? [];
  return (
    <section aria-label="Job-specific CV review" className="grid min-w-0 gap-s">
      <h3>Find relevant evidence for a job</h3>
      <p>
        Review keyword matches against your existing CV. A word match does not establish that you
        meet a requirement.
      </p>
      <Label>
        Job description
        <Textarea
          maxLength={20000}
          onChange={(event) => {
            setJob(event.target.value);
            setReview(null);
            setSelected([]);
          }}
          value={job}
        />
      </Label>
      <Button
        disabled={!job.trim() || disabled}
        onClick={() => {
          setReview(suggestCvEvidence(variant.profile, job));
          setSelected([]);
        }}
        type="button"
        variant="outline"
      >
        Review matching evidence
      </Button>
      {review && (
        <>
          <p>
            {review.length
              ? "Choose existing items for a separate version. Nothing is selected automatically."
              : "No matching evidence found. No qualifications have been added."}
          </p>
          {review.map((item) => {
            const key = `${item.field}:${item.id}`;
            return (
              <Label key={key}>
                <Input
                  checked={selected.includes(key)}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked
                        ? [...selected, key]
                        : selected.filter((entry) => entry !== key),
                    )
                  }
                  type="checkbox"
                />
                {item.title} — Matching terms: {item.matched.join(", ")}
              </Label>
            );
          })}
          <Button
            disabled={disabled || !selected.length}
            onClick={() => onCreate(tailorCvVariant(variant, choices))}
            type="button"
          >
            Create reviewed job version
          </Button>
          {requestInterviewPrep && choices.length > 0 && (
            <JobInterviewPrep
              choices={choices}
              job={job}
              key={selected.join("|")}
              profile={variant.profile}
              request={requestInterviewPrep}
            />
          )}
        </>
      )}
    </section>
  );
}
