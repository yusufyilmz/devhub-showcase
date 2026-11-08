import type React from "react";

import { getPortfolioCopy } from "@shared/config";
import { Section } from "@shared/ui/section";

import { ReferralItem } from "./ReferralItem";
import { referralSectionStyles } from "./styles";
import type { ReferralSectionProps } from "./types";

export const ReferralSection: React.FC<ReferralSectionProps> = ({ referrals, language = "en" }) => {
  const text = getPortfolioCopy(language);
  if (!referrals.length) return null;
  return (
    <Section
      className={referralSectionStyles.section}
      eyebrow={text.testimonials}
      sectionId="referrals"
      subtitle={text.testimonialsSubtitle}
      title={text.testimonials}
    >
      <ul className={referralSectionStyles.grid}>
        {referrals.map((referral) => (
          <li key={referral.id}>
            <ReferralItem referral={referral} />
          </li>
        ))}
      </ul>
    </Section>
  );
};
