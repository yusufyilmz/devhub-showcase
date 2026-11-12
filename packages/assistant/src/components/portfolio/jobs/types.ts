export type SearchFilters = {
  title: string;
  keywords: string;
  country: string;
  location: string;
  workplace: string;
  experience: string;
  employment: string;
  minimum: number | null;
  maximum: number | null;
  currency: string;
  preferredCompanies: string;
  excludedCompanies: string;
  excludedKeywords: string;
  sponsorship: boolean;
  postedDays: number;
};
export type SearchSettings = {
  name: string;
  filters: SearchFilters;
  hours: number;
  threshold: number;
  enabled: boolean;
};
export type Search = Omit<SearchSettings, "filters"> & {
  id: string;
  filters?: SearchFilters;
  due_at: string;
};
export type Listing = {
  title: string;
  company: string;
  location: string;
  description: string;
  source: string;
  minimum: number | null;
  maximum: number | null;
  currency: string;
  date: string | null;
  dateKind: "posted" | "updated";
};
export type Match = {
  id: string;
  listing: Listing;
  score: number;
  state: string;
  notified_at: string | null;
  explanation: { reason: string; matchedSkills: string[]; missingRequirements: string[] };
};
export type Draft = {
  summary: string;
  coverLetter: string;
  answers: { question: string; answer: string }[];
};
export type JobsData = {
  searches: Search[];
  jobs: Match[];
  runs: {
    id: string;
    search_id: string;
    created_at: string;
    examined: number;
    matched: number;
    issues: string[];
  }[];
  applications: { id: string; listing: Listing; status: string; draft: Draft | null }[];
  pushPublicKey: string | null;
};
export type RunJobAction = (command: object) => Promise<boolean>;
