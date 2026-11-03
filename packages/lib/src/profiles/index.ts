export type {
  PortfolioProfile,
  PortfolioSection,
  PortfolioSectionId,
  PortfolioType,
} from "@shared/config";

export type { AiEditProposal } from "./ai-edit";
export {
  aiEditFields,
  aiEditJsonSchema,
  aiEditProfileContract,
  aiEditProposalSchema,
  aiEditRequestSchema,
  applyAiEdit,
  serializeAiEditContext,
  validateAiEdit,
} from "./ai-edit";
export type { AssistantTaskOptions } from "./assistant-task";
export { assistantTaskSchema, writingProposal, writingSource } from "./assistant-task";
export { publicChatSources } from "./chat-sources";
export { createEmptyProfile } from "./empty-profiles";
export {
  applyGoogleProfile,
  type GoogleImportField,
  type GoogleProfileReview,
  googleImportFields,
  googleProfileReviewSchema,
  reviewGooglePerson,
} from "./google-profile";
export {
  buildOwnerPortfolioKnowledge,
  buildPublicPortfolioKnowledge,
  type KnowledgeItem,
  type KnowledgeSection,
  type OwnerPortfolioKnowledge,
  type PublicPortfolioKnowledge,
  serializePublicKnowledge,
} from "./portfolio-knowledge";
export {
  type EditableProfile,
  profileSchema,
  saveProfileSchema,
  validateProfile,
} from "./profile";
export type { ProfileSnapshot } from "./profile-snapshot";
export {
  cvPath,
  editCvPath,
  reservedUsernames,
  usernameSchema,
} from "./username";
