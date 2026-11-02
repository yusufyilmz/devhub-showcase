import type React from "react";

import { getPortfolioCopy } from "@shared/config";

import { List, ListItem } from "../../display/list";
import { Section } from "../../layout/section";
import { ReferralItem } from "./ReferralItem";
import { referralSectionStyles } from "./styles";
import type { ReferralSectionProps } from "./types";

export const ReferralSection: React.FC<ReferralSectionProps> = ({ referrals, language = "en" }) => {
  const text = getPortfolioCopy(language);
  if (!referrals.length) return null;
  return (
    <Section
      className={referralSectionStyles.element1}
      eyebrow={text.testimonials}
      sectionId="referrals"
      subtitle={text.testimonialsSubtitle}
      title={text.testimonials}
    >
      <div className={referralSectionStyles.element2}>
        <List className={referralSectionStyles.element3} divider>
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
