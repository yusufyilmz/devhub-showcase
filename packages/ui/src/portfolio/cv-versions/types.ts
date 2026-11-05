import type { PortfolioProfile } from "@shared/config";
import type { CvVariant } from "@shared/lib/profiles";
export type CvLibrary = { variants: CvVariant[]; revision: number };
export type InterviewPrepRequest = { job: string; evidence: { title: string; facts: string[] }[] };
export type InterviewPrep = { gaps: string[]; questions: string[]; summary: string };
export type RequestInterviewPrep = (
  input: InterviewPrepRequest,
  signal: AbortSignal,
) => Promise<InterviewPrep>;
export type CvVersionsProps = {
  profile: PortfolioProfile;
  sourceRevision: number;
  load: () => Promise<CvLibrary>;
  save: (library: CvLibrary) => Promise<CvLibrary>;
  downloadHref: (id: string) => string;
  requestInterviewPrep?: RequestInterviewPrep;
};
export type CvVersionFieldsProps = { variant: CvVariant; onChange: (variant: CvVariant) => void };
export type CvJobReviewProps = {
  variant: CvVariant;
  onCreate: (variant: CvVariant) => void;
  disabled: boolean;
  requestInterviewPrep?: RequestInterviewPrep;
};
