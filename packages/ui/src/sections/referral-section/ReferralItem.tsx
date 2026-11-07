import { Quote } from "lucide-react";

import { Card } from "../../cards";
import { referralItemStyles } from "./styles";
import type { ReferralItemProps } from "./types";

export function ReferralItem({ referral, children }: ReferralItemProps) {
  const name = referral.name || "Anonymous";

  return (
    <Card
      asChild
      className={referralItemStyles.card}
      interaction="static"
      layout="plain"
      surface="portfolio"
    >
      <figure>
        <Quote aria-hidden="true" className="size-6 text-primary" />
        <div className="grid gap-s">
          {referral.feedback && (
            <blockquote className={referralItemStyles.quote}>{referral.feedback}</blockquote>
          )}
          {referral.recommendation && (
            <blockquote className={referralItemStyles.quote}>{referral.recommendation}</blockquote>
          )}
        </div>
        {children}
        <figcaption className="mt-auto flex items-center gap-s border-t pt-s">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary"
          >
            {name.trim().slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <strong>{name}</strong>
            {referral.relationship && (
              <div className="text-sm text-muted-foreground">{referral.relationship}</div>
            )}
          </div>
        </figcaption>
      </figure>
    </Card>
  );
}
