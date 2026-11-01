import type React from "react";

import { getPortfolioCopy, type Language } from "@shared/config";
import type { Referral } from "@shared/lib/types";

import { List, ListItem } from "../../display/list";
import { Section } from "../../layout/section";
import { ReferralItem } from "./ReferralItem";

export const ReferralSection: React.FC<{
  referrals: Referral[];
  language?: Language;
}> = ({ referrals, language = "en" }) => {
  const text = getPortfolioCopy(language);
  if (!referrals.length) return null;
  return (
    <Section
      className="referral-section"
      eyebrow={text.testimonials}
      sectionId="referrals"
      subtitle={text.testimonialsSubtitle}
      title={text.testimonials}
    >
      <div className="referral-content">
        <List className="no-scrollbar w-full md:mt-0" divider>
          {referrals.map((referral) => (
            <ListItem key={referral.id}>
              <ReferralItem referral={referral} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  );
};
