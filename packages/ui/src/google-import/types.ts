import type { PortfolioProfile } from "@shared/config";
import type { GoogleImportField, GoogleProfileReview } from "@shared/lib/profiles";

export type GoogleImportReviewOptions = {
  profile: PortfolioProfile;
  review: GoogleProfileReview;
  selected: GoogleImportField[];
  onSelect: (fields: GoogleImportField[]) => void;
  onChange: (review: GoogleProfileReview) => void;
  onApply: () => void;
};

export type GoogleImportEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  managed?: boolean;
};

export type GoogleImportWorkspaceOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
