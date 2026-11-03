"use client";
import { useState } from "react";

import { suggestCvEvidence, tailorCvVariant } from "@shared/lib/profiles";

import { Button } from "../../buttons/button";
import { Input } from "../../forms/input";
import { Label } from "../../forms/label";
import { Textarea } from "../../forms/textarea";
import type { CvJobReviewProps } from "./types";
export function CvJobReview({ variant, onCreate, disabled }: CvJobReviewProps) {
  const [job, setJob] = useState("");
  const [review, setReview] = useState<ReturnType<typeof suggestCvEvidence> | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <section aria-label="Job-specific CV review" className="editor-fields">
      <h3>Find relevant evidence for a job</h3>
      <p>
        Local keyword matching only: no AI requests, invented qualifications or rewritten
        achievements. A word match is not proof that a requirement is met. Review the existing
        evidence yourself; missing requirements stay missing.
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
            onClick={() =>
              onCreate(
                tailorCvVariant(
                  variant,
                  review.filter((item) => selected.includes(`${item.field}:${item.id}`)),
                ),
              )
            }
            type="button"
          >
            Create reviewed job version
          </Button>
        </>
      )}
    </section>
  );
}
