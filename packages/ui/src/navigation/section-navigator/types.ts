export type PageSection = { id: string; title: string; description?: string };
export type SectionNavigatorProps = {
  sections?: PageSection[];
  label?: string;
};
