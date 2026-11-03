import type { PortfolioProfile } from "@shared/config";
import type { CvVariant } from "@shared/lib/profiles";
export type CvLibrary = { variants: CvVariant[]; revision: number };
export type CvVersionsProps = {
  profile: PortfolioProfile;
  sourceRevision: number;
  load: () => Promise<CvLibrary>;
  save: (library: CvLibrary) => Promise<CvLibrary>;
  downloadHref: (id: string) => string;
};
export type CvVersionFieldsProps = { variant: CvVariant; onChange: (variant: CvVariant) => void };
export type CvJobReviewProps = {
  variant: CvVariant;
  onCreate: (variant: CvVariant) => void;
  disabled: boolean;
};
