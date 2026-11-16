import type { Language } from "@shared/config";
import type { Referral } from "@shared/lib/types";

export interface ReferralItemProps {
  children?: React.ReactElement;
  referral: Pick<Referral, "name" | "feedback" | "recommendation" | "relationship">;
}
export interface ReferralSectionProps {
  language?: Language;
  referrals: Referral[];
}
